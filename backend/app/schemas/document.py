from pydantic import BaseModel
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
