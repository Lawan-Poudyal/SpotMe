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

class SelfieRequest(BaseModel):
    participant_id: str
    event_id: str 
    url: str

class SelfieResponse(BaseModel):
    participant_id: str
    status: str
    embedding: Optional[List[float]] = None
    error: Optional[str] = None