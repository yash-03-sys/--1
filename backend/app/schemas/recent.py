from typing import Any, Dict
from pydantic import BaseModel

class SourceMapResponse(BaseModel):
    nodes: list
    edges: list
