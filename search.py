from pydantic import BaseModel, HttpUrl
from typing import List, Optional, Literal

class WebSearchResult(BaseModel):
    title: str
    snippet: str
    url: HttpUrl
    source_type: Literal["web", "youtube", "image", "news"] = "web"
    thumbnail_url: Optional[HttpUrl] = None
    # Additional fields for YouTube results
    channel: Optional[str] = None
    duration: Optional[str] = None

class WebSearchResponse(BaseModel):
    query: str
    results: List[WebSearchResult]
    total_results: int

class WebSearchRequest(BaseModel):
    query: str = Field(..., min_length=1, description="The search query for web research.")