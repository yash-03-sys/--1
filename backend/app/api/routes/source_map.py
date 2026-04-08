from fastapi import APIRouter, Depends
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
