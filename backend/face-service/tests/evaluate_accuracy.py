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
 

def build_score_lists(app, data_dir: Path):
    ref_dir = data_dir / "reference"
    photos_dir = data_dir / "photos"
    labels_path = data_dir / "labels.json"
 
    with open(labels_path) as f:
        labels = json.load(f)
 
    print("Embedding reference selfies...")
    ref_embeddings = {}
    for ref_file in sorted(ref_dir.iterdir()):
        if ref_file.suffix.lower() not in (".jpg", ".jpeg", ".png"):
            continue
        name = ref_file.stem
        emb = get_single_embedding(app, str(ref_file))
        if emb is not None:
            ref_embeddings[name] = emb
            print(f"  {name}: OK")
 
    print("\nEmbedding event/group photos and scoring pairs...")
    genuine_scores = []
    impostor_scores = []
 
    for photo_file in sorted(photos_dir.iterdir()):
        if photo_file.suffix.lower() not in (".jpg", ".jpeg", ".png"):
            continue
        photo_name = photo_file.name
        present_people = set(labels.get(photo_name, []))
        if not present_people:
            print(f"  [WARN] No label entry for {photo_name}, skipping")
            continue
 
        face_embeddings = get_all_embeddings(app, str(photo_file))
        if not face_embeddings:
            print(f"  [WARN] No faces detected in {photo_name}, skipping")
            continue
 
        for person, ref_emb in ref_embeddings.items():
            # Best-matching face in this photo for this reference person
            best_sim = max(cosine_similarity(ref_emb, fe) for fe in face_embeddings)
 
            if person in present_people:
                genuine_scores.append(best_sim)
            else:
                # Hardest impostor case: closest wrong face in a photo
                # this person is NOT actually in
                impostor_scores.append(best_sim)
 
        print(f"  {photo_name}: {len(face_embeddings)} face(s) detected, "
              f"labeled present: {present_people}")
 
    return np.array(genuine_scores), np.array(impostor_scores)

 
def metrics_at_threshold(genuine, impostor, threshold):
    tp = np.sum(genuine >= threshold)
    fn = np.sum(genuine < threshold)
    tn = np.sum(impostor < threshold)
    fp = np.sum(impostor >= threshold)
 
    total = tp + fn + tn + fp
    accuracy = (tp + tn) / total if total > 0 else 0.0
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    far = fp / (fp + tn) if (fp + tn) > 0 else 0.0  # false acceptance rate
    frr = fn / (fn + tp) if (fn + tp) > 0 else 0.0  # false rejection rate
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0.0
 
    return {
        "threshold": threshold,
        "accuracy": accuracy,
        "precision": precision,
        "recall": recall,
        "f1": f1,
        "far": far,
        "frr": frr,
        "tp": int(tp), "fn": int(fn), "tn": int(tn), "fp": int(fp),
    }


 
def find_best_threshold(genuine, impostor, steps=200):
    best = None
    for t in np.linspace(0.0, 1.0, steps):
        m = metrics_at_threshold(genuine, impostor, t)
        if best is None or m["accuracy"] > best["accuracy"]:
            best = m
    return best
 
 
def print_metrics(m, label):
    print(f"\n--- {label} (threshold = {m['threshold']:.3f}) ---")
    print(f"  Accuracy:  {m['accuracy']*100:.2f}%")
    print(f"  Precision: {m['precision']*100:.2f}%")
    print(f"  Recall:    {m['recall']*100:.2f}%")
    print(f"  F1 score:  {m['f1']*100:.2f}%")
    print(f"  FAR:       {m['far']*100:.2f}%  (impostor pairs wrongly accepted)")
    print(f"  FRR:       {m['frr']*100:.2f}%  (genuine pairs wrongly rejected)")
    print(f"  Confusion: TP={m['tp']} FN={m['fn']} TN={m['tn']} FP={m['fp']}")
 