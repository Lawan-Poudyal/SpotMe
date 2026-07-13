from pydantic import BaseModel
from typing import List, Optional


class PhotoInput(BaseModel):
    photo_id: str
    url: str

class PhotoBatchRequest(BaseModel):
    event_id: str
    photos: List[PhotoInput]

class FaceEmbedding(BaseModel):
    face_index: int
    embedding: List[float]
    bbox: List[float]
    det_score: float

class PhotoResult(BaseModel):
    photo_id: str
    status: str # success | no_face | error
    faces: List[FaceEmbedding] = []
    error: Optional[str] = None

class PhotoBatchResponse(BaseModel):
    event_id:str
    results: List[PhotoResult]


