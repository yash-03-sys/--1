from sqlalchemy.orm import Session
from fastapi import UploadFile, HTTPException
import os
from app.models.document import Document, DocumentProcessingJob
from app.schemas.document import DocumentResponse, DocumentStatusResponse
from app.services.file_storage_service import FileStorageService

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
