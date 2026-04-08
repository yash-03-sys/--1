import os

backend_dir = r"c:\Users\STAR SUPER MARKET\Documents\--1\backend"

files_to_write = {
    "app/core/security.py": """from datetime import datetime, timedelta
from typing import Optional, Any
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(subject: Any, expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)
""",
    "app/services/auth_service.py": """from sqlalchemy.orm import Session
from fastapi import HTTPException
from google.oauth2 import id_token
from google.auth.transport import requests
from app.models.user import User
from app.models.user_settings import UserSettings
from app.core.config import settings
from app.schemas.auth import GoogleAuthRequest, TokenResponse
from app.core.security import create_access_token
import httpx

class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def verify_google_token_mock(self, token: str) -> dict:
        # Since we might not have a real client ID yet, fallback to a simple mock or 
        # actual verification if settings.GOOGLE_CLIENT_ID is present
        if not settings.GOOGLE_CLIENT_ID:
            # Fallback for local development
            return {
                "email": "testuser@example.com",
                "name": "Test User",
                "picture": "https://example.com/pic.jpg",
                "sub": "1234567890"
            }
        
        try:
            idinfo = id_token.verify_oauth2_token(
                token, requests.Request(), settings.GOOGLE_CLIENT_ID
            )
            return idinfo
        except ValueError:
            raise HTTPException(status_code=401, detail="Invalid Google token")

    def authenticate_google_user(self, auth_request: GoogleAuthRequest) -> TokenResponse:
        idinfo = self.verify_google_token_mock(auth_request.id_token)
        
        email = idinfo.get("email")
        name = idinfo.get("name")
        picture = idinfo.get("picture")
        
        if not email:
            raise HTTPException(status_code=400, detail="Email not provided by Google")

        user = self.db.query(User).filter(User.email == email).first()
        if not user:
            user = User(email=email, name=name, picture=picture)
            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)
            
            # Initialize default settings for new user
            user_settings = UserSettings(user_id=user.id, theme="dark black")
            self.db.add(user_settings)
            self.db.commit()
        
        access_token = create_access_token(subject=user.id)
        return TokenResponse(access_token=access_token)
""",
    "app/api/dependencies.py": """from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.core.config import settings
from app.db.session import get_db
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login", auto_error=False)

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> User:
    if not token:
        # Fallback for testing/dev if needed, but usually block
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    return user
""",
    "app/api/routes/auth.py": """from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.auth import GoogleAuthRequest, TokenResponse
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService
from app.api.dependencies import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/google", response_model=TokenResponse)
def google_auth(request: GoogleAuthRequest, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    return auth_service.authenticate_google_user(request)

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/logout")
def logout():
    # Client-side logout usually handles removing the token,
    # but we provide this endpoint for completeness/future blacklisting.
    return {"message": "Successfully logged out"}
""",
    "app/services/file_storage_service.py": """import os
import shutil
from fastapi import UploadFile
from app.core.config import settings

class FileStorageService:
    def __init__(self):
        self.upload_dir = settings.UPLOAD_DIR
        os.makedirs(self.upload_dir, exist_ok=True)

    def save_file(self, file: UploadFile, user_id: int) -> str:
        # Create user specific folder
        user_dir = os.path.join(self.upload_dir, str(user_id))
        os.makedirs(user_dir, exist_ok=True)
        
        file_path = os.path.join(user_dir, file.filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        return file_path
        
    def delete_file(self, file_path: str):
        if os.path.exists(file_path):
            os.remove(file_path)
""",
    "app/tasks/document_processing_tasks.py": """from app.db.session import SessionLocal
from app.models.document import Document, DocumentProcessingJob, DocumentChunk
from app.models.note import Note
# Try importing celery, if not available, just use a dummy task for now
try:
    from celery import shared_task
except ImportError:
    # Dummy decorator for local execution if celery is not set up
    def shared_task(func):
        return func

import time

@shared_task
def process_document_task(document_id: int):
    # This is a background task
    db = SessionLocal()
    try:
        doc = db.query(Document).filter(Document.id == document_id).first()
        job = db.query(DocumentProcessingJob).filter(DocumentProcessingJob.document_id == document_id).first()
        
        if not doc or not job:
            return
            
        job.status = "processing"
        job.progress_percentage = 10.0
        doc.status = "processing"
        db.commit()
        
        # Simulated extraction and chunking process
        # In a real scenario, use app.services.pdf_extraction_service here
        time.sleep(2)
        job.progress_percentage = 40.0
        db.commit()
        
        # Simulated embedding process
        time.sleep(2)
        job.progress_percentage = 80.0
        db.commit()
        
        # Complete
        job.status = "ready"
        job.progress_percentage = 100.0
        doc.status = "ready"
        
        # Create a default note for this document
        default_note = Note(
            user_id=doc.user_id,
            document_id=doc.id,
            title=f"Notes: {doc.filename}",
            content="Start typing your research notes here..."
        )
        db.add(default_note)
        db.commit()
        
    except Exception as e:
        job.status = "failed"
        job.error_message = str(e)
        if doc:
            doc.status = "failed"
        db.commit()
    finally:
        db.close()
""",
    "app/services/document_service.py": """from sqlalchemy.orm import Session
from fastapi import UploadFile, HTTPException
import os
from app.models.document import Document, DocumentProcessingJob
from app.schemas.document import DocumentResponse, DocumentStatusResponse
from app.services.file_storage_service import FileStorageService
from app.tasks.document_processing_tasks import process_document_task

class DocumentService:
    def __init__(self, db: Session):
        self.db = db
        self.file_storage = FileStorageService()

    def upload_document(self, file: UploadFile, user_id: int) -> DocumentResponse:
        file_path = self.file_storage.save_file(file, user_id)
        file_size = os.path.getsize(file_path)
        
        doc = Document(
            user_id=user_id,
            filename=file.filename,
            mime_type=file.content_type,
            file_path=file_path,
            file_size=file_size,
            status="uploaded"
        )
        self.db.add(doc)
        self.db.commit()
        self.db.refresh(doc)
        
        job = DocumentProcessingJob(
            document_id=doc.id,
            status="queued"
        )
        self.db.add(job)
        self.db.commit()
        
        # Trigger background processing
        process_document_task(doc.id) # Should be .delay(doc.id) if using celery
        
        return doc

    def get_documents(self, user_id: int):
        return self.db.query(Document).filter(Document.user_id == user_id).all()

    def get_document(self, document_id: int, user_id: int):
        doc = self.db.query(Document).filter(Document.id == document_id, Document.user_id == user_id).first()
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")
        return doc

    def get_document_status(self, document_id: int, user_id: int) -> DocumentStatusResponse:
        doc = self.get_document(document_id, user_id)
        job = self.db.query(DocumentProcessingJob).filter(DocumentProcessingJob.document_id == document_id).first()
        
        return DocumentStatusResponse(
            document_id=doc.id,
            status=job.status if job else doc.status,
            progress_percentage=job.progress_percentage if job else 0.0,
            error_message=job.error_message if job else None
        )

    def delete_document(self, document_id: int, user_id: int):
        doc = self.get_document(document_id, user_id)
        if doc.file_path:
            self.file_storage.delete_file(doc.file_path)
            
        self.db.delete(doc)
        self.db.commit()
        return {"message": "Document deleted successfully"}
""",
    "app/api/routes/documents.py": """from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.schemas.document import DocumentResponse, DocumentStatusResponse
from app.services.document_service import DocumentService

router = APIRouter()

@router.post("/upload", response_model=DocumentResponse)
def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Basic validation
    if not file.filename.endswith('.pdf') and not file.filename.endswith('.txt'):
        raise HTTPException(status_code=400, detail="Only PDF and TXT files are supported")
        
    doc_service = DocumentService(db)
    return doc_service.upload_document(file, current_user.id)

@router.get("", response_model=List[DocumentResponse])
def get_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc_service = DocumentService(db)
    return doc_service.get_documents(current_user.id)

@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc_service = DocumentService(db)
    return doc_service.get_document(document_id, current_user.id)

@router.get("/{document_id}/status", response_model=DocumentStatusResponse)
def get_document_status(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc_service = DocumentService(db)
    return doc_service.get_document_status(document_id, current_user.id)

@router.delete("/{document_id}")
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc_service = DocumentService(db)
    return doc_service.delete_document(document_id, current_user.id)
"""
}

for rel_path, content in files_to_write.items():
    full_path = os.path.join(backend_dir, rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Phase 3 and 4 setup completed.")
