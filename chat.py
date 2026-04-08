from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime

class ChatMessageBase(BaseModel):
    role: Literal["user", "assistant"]
    content: str

class ChatMessageResponse(ChatMessageBase):
    id: int
    session_id: int
    is_web_augmented: bool
    citations: Optional[str] = None # JSON string of citations
    created_at: datetime

    class Config:
        from_attributes = True

class ChatSessionBase(BaseModel):
    document_id: Optional[int] = None
    title: str

class ChatSessionResponse(ChatSessionBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    document_id: int = Field(..., description="ID of the document to chat about.")
    question: str = Field(..., min_length=1)
    augment_with_web: bool = False
    chat_session_id: Optional[int] = None # To continue an existing session