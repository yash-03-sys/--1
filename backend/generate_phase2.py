import os

backend_dir = r"c:\Users\STAR SUPER MARKET\Documents\--1\backend"

files_to_write = {
    "app/core/config.py": """from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    APP_NAME: str = "::-1"
    APP_ENV: str = "development"
    APP_DEBUG: bool = True
    
    DATABASE_URL: str = "postgresql://user:password@localhost/db_name"
    REDIS_URL: str = "redis://localhost:6379/0"
    
    JWT_SECRET: str = "super-secret-key"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    
    GOOGLE_CLIENT_ID: str = ""
    GEMINI_API_KEY: str = ""
    SEARCH_API_KEY: str = ""
    SEARCH_PROVIDER: str = "google"
    
    VECTOR_DB_PATH: str = "./vector_db"
    UPLOAD_DIR: str = "./uploads"
    MAX_FILE_SIZE_MB: int = 50
    ALLOWED_UPLOAD_TYPES: List[str] = ["application/pdf", "text/plain"]
    
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
""",
    ".env.example": """APP_NAME="::-1"
APP_ENV="development"
APP_DEBUG=true

DATABASE_URL="postgresql://user:password@localhost/db_name"
REDIS_URL="redis://localhost:6379/0"

JWT_SECRET="replace-with-secure-secret"
JWT_ALGORITHM="HS256"

GOOGLE_CLIENT_ID="your-google-client-id"
GEMINI_API_KEY="your-gemini-api-key"
SEARCH_API_KEY="your-search-api-key"
SEARCH_PROVIDER="google"

VECTOR_DB_PATH="./vector_db"
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE_MB=50
CORS_ORIGINS=["http://localhost:5173"]
""",
    "app/db/base.py": """from sqlalchemy.orm import declarative_base

Base = declarative_base()
""",
    "app/db/session.py": """from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
""",
    "app/models/user.py": """from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.db.base import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String)
    picture = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
""",
    "app/models/document.py": """from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String, nullable=False)
    mime_type = Column(String)
    file_path = Column(String)
    file_size = Column(Integer)
    status = Column(String, default="queued") # queued, uploading, uploaded, processing, ready, failed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class DocumentProcessingJob(Base):
    __tablename__ = "document_processing_jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    status = Column(String, default="queued")
    progress_percentage = Column(Float, default=0.0)
    error_message = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class DocumentChunk(Base):
    __tablename__ = "document_chunks"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    chunk_index = Column(Integer)
    content = Column(String)
    page_number = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
""",
    "app/models/chat.py": """from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base

class ChatSession(Base):
    __tablename__ = "chat_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=True)
    title = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id"), nullable=False)
    role = Column(String, nullable=False) # user, assistant
    content = Column(Text, nullable=False)
    citations = Column(String, nullable=True) # JSON stored as string for simplicity, or JSON column if supported
    created_at = Column(DateTime(timezone=True), server_default=func.now())
""",
    "app/models/note.py": """from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from app.db.base import Base

class Note(Base):
    __tablename__ = "notes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=True)
    title = Column(String, nullable=False)
    content = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
""",
    "app/models/source_map.py": """from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from app.db.base import Base

class SourceMap(Base):
    __tablename__ = "source_maps"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    topic = Column(String, nullable=False)
    graph_data = Column(Text) # JSON serialized
    created_at = Column(DateTime(timezone=True), server_default=func.now())
""",
    "app/models/web_search_history.py": """from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from app.db.base import Base

class WebSearchHistory(Base):
    __tablename__ = "web_search_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    query = Column(String, nullable=False)
    results = Column(Text) # JSON serialized
    created_at = Column(DateTime(timezone=True), server_default=func.now())
""",
    "app/models/user_settings.py": """from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.db.base import Base

class UserSettings(Base):
    __tablename__ = "user_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    theme = Column(String, default="dark black") # dark black, white, grey, premium
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
""",
    "app/models/__init__.py": """from app.models.user import User
from app.models.document import Document, DocumentProcessingJob, DocumentChunk
from app.models.chat import ChatSession, ChatMessage
from app.models.note import Note
from app.models.source_map import SourceMap
from app.models.web_search_history import WebSearchHistory
from app.models.user_settings import UserSettings
from app.db.base import Base
""",
    "app/schemas/user.py": """from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    picture: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
""",
    "app/schemas/auth.py": """from pydantic import BaseModel

class GoogleAuthRequest(BaseModel):
    id_token: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
""",
    "app/schemas/document.py": """from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DocumentResponse(BaseModel):
    id: int
    filename: str
    status: str
    file_size: Optional[int] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class DocumentStatusResponse(BaseModel):
    document_id: int
    status: str
    progress_percentage: float
    error_message: Optional[str] = None
""",
    "app/schemas/chat.py": """from pydantic import BaseModel
from typing import List, Optional

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[int] = None
    document_id: Optional[int] = None
    use_web_search: bool = False

class ChatResponse(BaseModel):
    reply: str
    session_id: int
    citations: Optional[List[dict]] = None
""",
    "app/schemas/search.py": """from pydantic import BaseModel
from typing import List, Optional

class SearchRequest(BaseModel):
    query: str

class SearchResultItem(BaseModel):
    title: str
    snippet: str
    source_url: str
    source_type: str
    thumbnail: Optional[str] = None

class SearchResponse(BaseModel):
    query: str
    results: List[SearchResultItem]
""",
    "app/schemas/note.py": """from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class NoteCreate(BaseModel):
    title: str
    content: str
    document_id: Optional[int] = None

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class NoteResponse(BaseModel):
    id: int
    title: str
    content: str
    document_id: Optional[int]
    updated_at: datetime

    class Config:
        from_attributes = True
""",
    "app/schemas/source_map.py": """from pydantic import BaseModel
from typing import Any, Dict

class SourceMapRequest(BaseModel):
    topic: str
    document_id: int

class SourceMapResponse(BaseModel):
    topic: str
    graph_data: Dict[str, Any]
""",
    "app/schemas/settings.py": """from pydantic import BaseModel

class ThemeUpdateRequest(BaseModel):
    theme: str # 'dark black', 'white', 'grey', 'premium'

class SettingsResponse(BaseModel):
    theme: str
"""
}

for rel_path, content in files_to_write.items():
    full_path = os.path.join(backend_dir, rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Phase 2 setup completed.")
