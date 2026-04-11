from datetime import datetime
from pydantic import BaseModel

class MessageBase(BaseModel):
    content: str
    role: str

class MessageCreate(MessageBase):
    chat_id: int

class Message(MessageBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
