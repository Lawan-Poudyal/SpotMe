import cv2
from app.core.insightface_client import app

async def detect_faces(image):

    faces = app.get(image)

    return faces