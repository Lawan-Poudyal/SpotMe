from fastapi import APIRouter, UploadFile, File
from app.core.insightface_client import app
from app.services.similarity import cosine_similarity
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

@router.post("/search")
async def search_face(
    selfie: UploadFile = File(...),
    image: UploadFile = File(...)
):
    selfie_bytes = await selfie.read()

    selfie_np = np.frombuffer(
        selfie_bytes,
        np.uint8
    )

    selfie_img = cv2.imdecode(
        selfie_np,
        cv2.IMREAD_COLOR
    )

    selfie_faces = app.get(
        selfie_img
    )

    if len(selfie_faces) == 0:
        return {
            "error": "No face found in selfie"
        }

    if len(selfie_faces) > 1:
        return {
            "error": "Multiple faces found in selfie"
        }

    query_embedding = selfie_faces[0].embedding

    image_bytes = await image.read()

    image_np = np.frombuffer(
        image_bytes,
        np.uint8
    )

    target_img = cv2.imdecode(
        image_np,
        cv2.IMREAD_COLOR
    )

    faces = app.get(
        target_img
    )

    if len(faces) == 0:
        return {
            "found": False,
            "message": "No faces found in target image"
        }

    threshold = 0.6

    max_similarity = -1
    matched_face_index = None

    for idx, face in enumerate(faces):

        similarity = cosine_similarity(
            query_embedding,
            face.embedding
        )

        if similarity > max_similarity:
            max_similarity = similarity
            matched_bbox = face.bbox.tolist()

    return {
        "found": bool(max_similarity > threshold),
        "max_similarity": round(
            float(max_similarity),
            4
        ),
        "matched_bbox": matched_bbox,
        "faces_detected": len(faces)
    }