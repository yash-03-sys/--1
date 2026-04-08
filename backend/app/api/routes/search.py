from fastapi import APIRouter, Depends
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
