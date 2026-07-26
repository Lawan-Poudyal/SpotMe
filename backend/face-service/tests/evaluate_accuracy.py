import argparse
import json
import os
from pathlib import Path
import cv2
import numpy as np
from insightface.app import FaceAnalysis


def load_model():
    app = FaceAnalysis(name="buffalo_l", providers=["CPUExecutionProvider"])
    app.prepare(ctx_id=0, det_size=(640, 640))
    return app


def get_single_embedding(app, img_path: str):
    """For reference selfies -- expects exactly one face, picks the largest if multiple."""
    img = cv2.imread(img_path)
    if img is None:
        raise ValueError(f"Could not read image: {img_path}")
    faces = app.get(img)
    if not faces:
        print(f"  [WARN] No face detected in reference image: {img_path}")
        return None
    if len(faces) > 1:
        faces = [max(faces, key=lambda f: (f.bbox[2] - f.bbox[0]) * (f.bbox[3] - f.bbox[1]))]
    return faces[0].embedding
 
 
def get_all_embeddings(app, img_path: str):
    """For event photos -- returns embeddings for every detected face."""
    img = cv2.imread(img_path)
    if img is None:
        raise ValueError(f"Could not read image: {img_path}")
    faces = app.get(img)
    return [f.embedding for f in faces]
 
def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    a, b = np.asarray(a), np.asarray(b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))
 
