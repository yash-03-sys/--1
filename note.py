from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class NoteBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    content: str = ""

class NoteCreate(NoteBase):
    document_id: Optional[int] = None

class NoteUpdate(NoteBase):
    # All fields are optional for update
    title: Optional[str] = None
    content: Optional[str] = None

class NoteResponse(NoteBase):
    id: int
    owner_id: int
    document_id: Optional[int] = None
    is_autosave: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class NoteAutosave(BaseModel):
    content: str