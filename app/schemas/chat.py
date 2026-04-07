from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class MessageBase(BaseModel):
    content: str
    role: str

class MessageCreate(MessageBase):
    pass

class Message(MessageBase):
    id: int
    chat_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ChatBase(BaseModel):
    title: Optional[str] = None

class ChatCreate(ChatBase):
    document_id: int

class Chat(ChatBase):
    id: int
    owner_id: int
    document_id: int
    created_at: datetime

    class Config:
        from_attributes = True
