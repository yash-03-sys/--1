from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class ChatMessageBase(BaseModel):
    content: str
    role: str

class ChatMessageCreate(ChatMessageBase):
    pass

class ChatMessage(ChatMessageBase):
    id: int
    session_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ChatSessionBase(BaseModel):
    document_id: int

class ChatSession(ChatSessionBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
