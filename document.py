from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime

DocumentStatus = Literal["queued", "uploading", "uploaded", "processing", "ready", "failed"]

class DocumentBase(BaseModel):
    filename: str
    mime_type: str
    file_size_bytes: int

class DocumentUploadRequest(BaseModel):
    # File will be sent as multipart/form-data, this schema is more for metadata if any
    # For now, just a placeholder, actual file handling is via FastAPI's UploadFile
    pass

class DocumentResponse(DocumentBase):
    id: int
    owner_id: int
    status: DocumentStatus
    processing_progress: int
    error_message: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DocumentStatusResponse(BaseModel):
    status: DocumentStatus
    progress: int = Field(..., ge=0, le=100)
    message: Optional[str] = None
    error_message: Optional[str] = None