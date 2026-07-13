import cv2
import numpy as np
import httpx
from app.core.insightface_client import insightface_client

MIN_DET_SCORE = 0.5 # to discard low confidence detections

async def download_image(url: str ) -> np.ndarray:
    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.get(url)
        resp.raise_for_status()
    
    img_array = np.frombuffer(resp.content, dtype=np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

    if img is None:
        raise ValueError("Could not decode image")
    
    return img

def detect_face(img : np.ndarray, min_score: float = MIN_DET_SCORE):
    app = insightface_client.get_app()
    faces = app.get(img)

    return [f for f in faces if f.det_score >= min_score]
