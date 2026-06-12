from insightface.app import FaceAnalysis
import cv2
import numpy as np
import os


# Initialize InsightFace

app = FaceAnalysis(
    name="buffalo_l",
    providers=["CPUExecutionProvider"]
)

app.prepare(ctx_id=0)


# Cosine similarity function

def cosine_similarity(emb1, emb2):
    return np.dot(emb1, emb2) / (
        np.linalg.norm(emb1) * np.linalg.norm(emb2)
    )

# Get embedding from selfie

selfie_path = "test_images/selfie.jpg"

img = cv2.imread(selfie_path)

faces = app.get(img)

if len(faces) == 0:
    print("No face found in selfie.")
    exit()

if len(faces) > 1:
    print("Multiple faces found in selfie. Use a clear solo photo.")
    exit()

query_embedding = faces[0].embedding

print("Selfie processed successfully.\n")

# Search event images

threshold = 0.6

folder = "test_images"

for filename in os.listdir(folder):

    if filename == "selfie.jpg":
        continue

    path = os.path.join(folder, filename)

    img = cv2.imread(path)

    if img is None:
        continue

    faces = app.get(img)

    print(f"Checking {filename}...")
    print(f"Detected {len(faces)} face(s)")

    found = False

    for i, face in enumerate(faces):

        similarity = cosine_similarity(
            query_embedding,
            face.embedding
        )

        print(
            f"  Face {i+1}: Similarity = {similarity:.3f}"
        )

        if similarity > threshold:
            found = True

    if found:
        print(f"✅ YOU ARE IN {filename}\n")
    else:
        print(f"❌ YOU ARE NOT IN {filename}\n")