from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Literal, Optional

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    APP_NAME: str = "::-1"
    APP_ENV: Literal["development", "testing", "production"] = "development"
    APP_DEBUG: bool = False
    LOG_LEVEL: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = "INFO"

    DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost:5432/colon_colon_minus_one_db"
    REDIS_URL: str = "redis://localhost:6379/0"

    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    GOOGLE_CLIENT_ID: str

    GEMINI_API_KEY: str

    SEARCH_PROVIDER: Literal["google_cse", "serpapi", "mock"] = "mock" # Default to mock for development
    SEARCH_API_KEY: Optional[str] = None
    GOOGLE_CSE_CX: Optional[str] = None # Required if SEARCH_PROVIDER is google_cse

    UPLOAD_DIR: str = "/tmp/uploads" # Default to /tmp for local development
    MAX_FILE_SIZE_MB: int = 50
    ALLOWED_UPLOAD_TYPES: List[str] = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", # .docx
        "text/plain"
    ]

    VECTOR_DB_PATH: str = "./data/chroma_db" # Path for ChromaDB persistence

    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]

    # Celery settings
    CELERY_BROKER_URL: str = "redis://localhost:6379/1" # Use a different DB for Celery broker
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2" # Use a different DB for Celery results


settings = Settings()