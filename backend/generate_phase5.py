import os

backend_dir = r"c:\Users\STAR SUPER MARKET\Documents\--1\backend"

files_to_write = {
    "app/services/llm_answer_service.py": """from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from app.core.config import settings
import json

class LLMAnswerService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        if self.api_key:
            self.llm = ChatGoogleGenerativeAI(
                model="gemini-1.5-pro",
                google_api_key=self.api_key,
                temperature=0.2
            )
        else:
            self.llm = None

    def generate_answer(self, query: str, context: str, use_web: bool = False) -> str:
        if not self.llm:
            return "Mock Answer: Please set GEMINI_API_KEY in your environment variables to enable real AI responses. You asked: " + query
            
        prompt_template = PromptTemplate(
            input_variables=["query", "context"],
            template=\"\"\"
You are an expert AI research assistant. Answer the user's query based ONLY on the provided context.
If the answer is not in the context, say "I don't have enough information to answer that."
Be concise, clear, and professional.

Context:
{context}

Query: {query}
Answer:
\"\"\"
        )
        
        prompt = prompt_template.format(query=query, context=context)
        response = self.llm.invoke(prompt)
        return response.content

    def generate_source_map(self, topic: str, context: str) -> dict:
        if not self.llm:
            return {
                "nodes": [
                    {"id": "1", "label": topic, "group": "topic"},
                    {"id": "2", "label": "Mock Subtopic 1", "group": "subtopic"},
                    {"id": "3", "label": "Mock Document Extract", "group": "chunk"}
                ],
                "links": [
                    {"source": "1", "target": "2"},
                    {"source": "2", "target": "3"}
                ]
            }

        prompt_template = PromptTemplate(
            input_variables=["topic", "context"],
            template=\"\"\"
Based on the following context about "{topic}", create a mind map structure.
Output ONLY valid JSON in the following format:
{{
  "nodes": [
    {{"id": "1", "label": "Main Topic", "group": "topic"}},
    {{"id": "2", "label": "Subtopic A", "group": "subtopic"}},
    {{"id": "3", "label": "Related Detail", "group": "chunk"}}
  ],
  "links": [
    {{"source": "1", "target": "2"}},
    {{"source": "2", "target": "3"}}
  ]
}}

Context:
{context}
\"\"\"
        )
        
        try:
            prompt = prompt_template.format(topic=topic, context=context)
            response = self.llm.invoke(prompt)
            # Basic cleanup if the model wraps the response in markdown blocks
            content = response.content.replace("```json", "").replace("```", "").strip()
            return json.loads(content)
        except Exception as e:
            print(f"Error generating source map: {e}")
            return {"nodes": [{"id": "1", "label": topic, "group": "topic"}], "links": []}
""",
    "app/services/retrieval_service.py": """from sqlalchemy.orm import Session
from app.models.document_chunk import DocumentChunk
# In a real app, this would use ChromaDB or FAISS to do vector similarity search
# For this scaffold, we will mock the retrieval or do a basic keyword search

class RetrievalService:
    def __init__(self, db: Session):
        self.db = db

    def retrieve_context(self, query: str, document_id: int, top_k: int = 3) -> list:
        # Mock retrieval: in a real scenario, embed the query and search ChromaDB
        # Here we just fetch the first few chunks of the document
        chunks = self.db.query(DocumentChunk).filter(
            DocumentChunk.document_id == document_id
        ).limit(top_k).all()
        
        if not chunks:
            # Return some mock context if document chunks aren't processed yet
            return [
                {
                    "content": "This is a simulated document chunk since vector search is not yet fully initialized. It contains information related to the uploaded document.",
                    "page_number": 1,
                    "chunk_index": 0
                }
            ]
            
        return [
            {
                "content": c.content,
                "page_number": c.page_number,
                "chunk_index": c.chunk_index
            } for c in chunks
        ]
""",
    "app/services/web_search_service.py": """import httpx
from app.core.config import settings
from app.schemas.search import SearchResultItem

class WebSearchService:
    def __init__(self):
        self.api_key = settings.SEARCH_API_KEY
        self.provider = settings.SEARCH_PROVIDER

    async def search(self, query: str) -> list[SearchResultItem]:
        # If no API key is provided, return mock data
        if not self.api_key:
            return [
                SearchResultItem(
                    title=f"Mock Search Result 1 for '{query}'",
                    snippet="This is a simulated snippet from a web search because no SEARCH_API_KEY was provided.",
                    source_url="https://example.com/result1",
                    source_type="web"
                ),
                SearchResultItem(
                    title=f"Mock Video Result for '{query}'",
                    snippet="A great video explaining the topic.",
                    source_url="https://youtube.com/watch?v=mock",
                    source_type="video",
                    thumbnail="https://example.com/thumb.jpg"
                )
            ]
            
        # Implementation for a real provider like Google Custom Search, Serper, or Tavily would go here
        # Example pseudo-code:
        # async with httpx.AsyncClient() as client:
        #     response = await client.get(f"https://api.serper.dev/search?q={query}&apiKey={self.api_key}")
        #     data = response.json()
        #     ... map data to SearchResultItem list ...
        
        return []
""",
    "app/api/routes/chat.py": """from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
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
""",
    "app/api/routes/search.py": """from fastapi import APIRouter, Depends
from app.api.dependencies import get_current_user
from app.models.user import User
from app.schemas.search import SearchRequest, SearchResponse
from app.services.web_search_service import WebSearchService
from app.db.session import get_db
from sqlalchemy.orm import Session
from app.models.web_search_history import WebSearchHistory
import json

router = APIRouter()

@router.post("/web", response_model=SearchResponse)
async def web_search(
    request: SearchRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    search_service = WebSearchService()
    results = await search_service.search(request.query)
    
    # Save history
    history = WebSearchHistory(
        user_id=current_user.id,
        query=request.query,
        results=json.dumps([r.model_dump() for r in results])
    )
    db.add(history)
    db.commit()
    
    return SearchResponse(query=request.query, results=results)
""",
    "app/api/routes/source_map.py": """from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.models.source_map import SourceMap as SourceMapModel
from app.schemas.source_map import SourceMapRequest, SourceMapResponse
from app.services.retrieval_service import RetrievalService
from app.services.llm_answer_service import LLMAnswerService
import json

router = APIRouter()

@router.post("/generate", response_model=SourceMapResponse)
def generate_source_map(
    request: SourceMapRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    retrieval_service = RetrievalService(db)
    chunks = retrieval_service.retrieve_context(request.topic, request.document_id, top_k=5)
    context_text = "\n\n".join([c["content"] for c in chunks])
    
    llm_service = LLMAnswerService()
    graph_data = llm_service.generate_source_map(request.topic, context_text)
    
    # Save to db
    source_map_record = SourceMapModel(
        user_id=current_user.id,
        topic=request.topic,
        graph_data=json.dumps(graph_data)
    )
    db.add(source_map_record)
    db.commit()
    
    return SourceMapResponse(topic=request.topic, graph_data=graph_data)
"""
}

for rel_path, content in files_to_write.items():
    full_path = os.path.join(backend_dir, rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Phase 5 setup completed.")
