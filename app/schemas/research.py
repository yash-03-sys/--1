from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class ResearchBase(BaseModel):
    query: str
    results: Optional[str] = None

class ResearchCreate(ResearchBase):
    chat_id: int

class Research(ResearchBase):
    id: int
    chat_id: int
    created_at: datetime

    class Config:
        from_attributes = True
