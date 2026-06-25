from pydantic import BaseModel

class SearchResponse(BaseModel):
    found: bool
    max_similarity: float