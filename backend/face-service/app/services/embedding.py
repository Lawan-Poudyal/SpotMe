from typing import List
from app.models.schemas import FaceEmbedding

def extract_embeddings(faces) -> List[FaceEmbedding]:
    results = []
    for idx, face in enumerate(faces):
        results.append(FaceEmbedding(
            face_index = idx,
            embedding=face.embedding.tolist(),
            bbox=face.bbox.tolist(),
            det_score=float(face.det_score)
        )) 
    
    return results