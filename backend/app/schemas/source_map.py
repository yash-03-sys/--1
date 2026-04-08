from pydantic import BaseModel
from typing import Any, Dict

class SourceMapRequest(BaseModel):
    topic: str
    document_id: int

class SourceMapResponse(BaseModel):
    topic: str
    graph_data: Dict[str, Any]
