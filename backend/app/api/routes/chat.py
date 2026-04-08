from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.models.document import Document
from app.models.chat import ChatSession, ChatMessage
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.retrieval_service import RetrievalService
from app.services.llm_answer_service import LLMAnswerService
from app.services.web_search_service import WebSearchService
import json

router = APIRouter()

@router.post("/ask", response_model=ChatResponse)
async def ask_question(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not request.document_id:
        raise HTTPException(status_code=400, detail="Upload a document before asking questions.")

    document = db.query(Document).filter(
        Document.id == request.document_id,
        Document.user_id == current_user.id
    ).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    if document.status != "ready":
        raise HTTPException(status_code=409, detail="Document is still processing. Please try again shortly.")

    # 1. Manage Chat Session
    if request.session_id:
        session = db.query(ChatSession).filter(
            ChatSession.id == request.session_id,
            ChatSession.user_id == current_user.id
        ).first()
        if not session:
            raise HTTPException(status_code=404, detail="Chat session not found")
    else:
        title = request.message[:50] + "..." if len(request.message) > 50 else request.message
        session = ChatSession(user_id=current_user.id, document_id=request.document_id, title=title)
        db.add(session)
        db.commit()
        db.refresh(session)
        
    # Save User Message
    user_msg = ChatMessage(session_id=session.id, role="user", content=request.message)
    db.add(user_msg)
    db.commit()

    # 2. Retrieve Context
    context_text = ""
    citations = []
    
    if request.document_id:
        retrieval_service = RetrievalService(db)
        chunks = retrieval_service.retrieve_context(request.message, request.document_id)
        context_text = "\n\n".join([c["content"] for c in chunks])
        citations = [{"page": c.get("page_number", 0), "text": c["content"][:100] + "..."} for c in chunks]

    if not context_text.strip() and not request.use_web_search:
        answer = "I couldn't find any indexed text for that question in the uploaded PDF yet."
        assistant_msg = ChatMessage(
            session_id=session.id,
            role="assistant",
            content=answer,
            citations=json.dumps([]),
        )
        db.add(assistant_msg)
        db.commit()
        return ChatResponse(reply=answer, session_id=session.id, citations=[])

    # 3. Web Search Augmentation (Optional)
    if request.use_web_search:
        web_service = WebSearchService()
        web_results = await web_service.search(request.message)
        web_context = "\n".join([f"Source ({r.source_url}): {r.snippet}" for r in web_results])
        context_text += "\n\nWeb Search Results:\n" + web_context
        citations.extend([{"url": r.source_url, "title": r.title} for r in web_results])

    # 4. Generate LLM Answer
    llm_service = LLMAnswerService()
    answer = llm_service.generate_answer(request.message, context_text, request.use_web_search)

    # Save Assistant Message
    assistant_msg = ChatMessage(
        session_id=session.id, 
        role="assistant", 
        content=answer,
        citations=json.dumps(citations)
    )
    db.add(assistant_msg)
    db.commit()

    return ChatResponse(
        reply=answer,
        session_id=session.id,
        citations=citations
    )

@router.get("/sessions/{session_id}/messages")
def get_chat_messages(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session = db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == current_user.id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")
        
    messages = db.query(ChatMessage).filter(ChatMessage.session_id == session_id).order_by(ChatMessage.created_at.asc()).all()
    
    result = []
    for m in messages:
        cits = []
        if m.citations:
            try:
                cits = json.loads(m.citations)
            except:
                pass
        result.append({
            "id": m.id,
            "role": m.role,
            "content": m.content,
            "citations": cits,
            "created_at": m.created_at
        })
    return result
