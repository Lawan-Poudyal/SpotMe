from fastapi import APIRouter, UploadFile, File
from app.core.insightface_client import app
import cv2
import numpy as np

router = APIRouter()

@router.get("/health")
def health():
    return {
        "status": "healthy"
    }


@router.post("/detect")
async def detect_faces(
    image: UploadFile = File(...)
):

    # Read uploaded file
    contents = await image.read()

    # Convert bytes -> numpy array
    nparr = np.frombuffer(contents, np.uint8)

    # Decode image
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        return {
            "error": "Invalid image"
        }

    # Detect faces
    faces = app.get(img)

    results = []

    for face in faces:
        results.append({
            "bbox": face.bbox.tolist()
        })

    return {
        "filename": image.filename,
        "faces_detected": len(faces),
        "faces": results
    }

