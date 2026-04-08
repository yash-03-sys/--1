from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime

class SourceMapNode(BaseModel):
    id: str = Field(..., description="Unique identifier for the node.")
    label: str = Field(..., description="Display label for the node.")
    type: Literal["topic", "subtopic", "document_chunk", "web_reference", "youtube_reference", "citation"]
    data: dict = Field(default_factory=dict, description="Additional data relevant to the node type (e.g., page_number, url, snippet).")

class SourceMapEdge(BaseModel):
    source: str = Field(..., description="ID of the source node.")
    target: str = Field(..., description="ID of the target node.")
    type: str = Field(..., description="Type of relationship (e.g., 'relates_to', 'cites', 'explains').")
    label: Optional[str] = None

class SourceMapResponse(BaseModel):
    id: int
    user_id: int
    document_id: Optional[int] = None
    title: str
    topic: Optional[str] = None
    nodes: List[SourceMapNode]
    edges: List[SourceMapEdge]
    created_at: datetime
    updated_at: datetime

class SourceMapGenerateRequest(BaseModel):
    document_id: Optional[int] = Field(None, description="Optional ID of the document to base the source map on.")
    topic: str = Field(..., min_length=1, description="The central topic for which to generate the source map.")