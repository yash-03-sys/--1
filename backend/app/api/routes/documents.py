from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.schemas.document import DocumentResponse, DocumentStatusResponse
from app.services.document_service import DocumentService
from app.tasks.document_processing_tasks import process_document_task

router = APIRouter()

@router.post("/upload", response_model=DocumentResponse)
def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Basic validation
    filename = (file.filename or "").lower()
    if not filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
    doc_service = DocumentService(db)
    document = doc_service.upload_document(file, current_user.id)
    background_tasks.add_task(process_document_task, document.id)
    return document

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
