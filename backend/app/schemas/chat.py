from pydantic import BaseModel
from typing import List, Optional

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[int] = None
    document_id: Optional[int] = None
    use_web_search: bool = False

class ChatResponse(BaseModel):
    reply: str
    session_id: int
    citations: Optional[List[dict]] = None
