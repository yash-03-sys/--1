from pathlib import Path
from pydantic_settings import BaseSettings
from typing import List

BASE_DIR = Path(__file__).resolve().parents[2]
DEFAULT_DB_PATH = BASE_DIR / "sql_app.db"
DEFAULT_VECTOR_DB_PATH = BASE_DIR / "vector_db"
DEFAULT_UPLOAD_DIR = BASE_DIR / "uploads"

class Settings(BaseSettings):
    APP_NAME: str = "::-1"
    APP_ENV: str = "development"
    APP_DEBUG: bool = True
    
    DATABASE_URL: str = f"sqlite:///{DEFAULT_DB_PATH.as_posix()}"
    REDIS_URL: str = "redis://localhost:6379/0"
    
    JWT_SECRET: str = "super-secret-key"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    
    GOOGLE_CLIENT_ID: str = ""
    GEMINI_API_KEY: str = ""
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    GROQ_BASE_URL: str = "https://api.groq.com/openai/v1"
    SEARCH_API_KEY: str = ""
    SEARCH_PROVIDER: str = "google"
    
    VECTOR_DB_PATH: str = str(DEFAULT_VECTOR_DB_PATH)
    UPLOAD_DIR: str = str(DEFAULT_UPLOAD_DIR)
    MAX_FILE_SIZE_MB: int = 50
    ALLOWED_UPLOAD_TYPES: List[str] = ["application/pdf", "text/plain"]
    
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    class Config:
        env_file = str(BASE_DIR / ".env")
        case_sensitive = True

settings = Settings()
