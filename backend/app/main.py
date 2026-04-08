from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth, documents, chat, search, notes, source_map, settings as settings_routes, health
from app.db.session import engine
from app.core.config import settings
from app.models import Base
from contextlib import asynccontextmanager

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="::-1 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS + ["http://127.0.0.1:3000", "http://127.0.0.1:5173"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(documents.router, prefix="/api/documents", tags=["documents"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(search.router, prefix="/api/search", tags=["search"])
app.include_router(notes.router, prefix="/api/notes", tags=["notes"])
app.include_router(source_map.router, prefix="/api/source-map", tags=["source-map"])
app.include_router(settings_routes.router, prefix="/api/settings", tags=["settings"])
app.include_router(health.router, prefix="/api/health", tags=["health"])

@app.get("/")
async def root():
    return {"message": "Welcome to ::-1 API"}
