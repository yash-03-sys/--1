from pydantic import BaseModel
from typing import List, Optional

class SearchRequest(BaseModel):
    query: str

class SearchResultItem(BaseModel):
    title: str
    snippet: str
    source_url: str
    source_type: str
    thumbnail: Optional[str] = None

class SearchResponse(BaseModel):
    query: str
    results: List[SearchResultItem]
