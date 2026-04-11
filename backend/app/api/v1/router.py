from fastapi import APIRouter
from app.api.v1.endpoints import (
    health,
    chat,
    documents,
    websearch,
    notes,
    themes,
    recents,
    users,
)

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(websearch.router, prefix="/websearch", tags=["websearch"])
api_router.include_router(notes.router, prefix="/notes", tags=["notes"])
api_router.include_router(themes.router, prefix="/themes", tags=["themes"])
api_router.include_router(recents.router, prefix="/recents", tags=["recents"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
