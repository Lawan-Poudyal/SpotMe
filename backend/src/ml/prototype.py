from insightface.app import FaceAnalysis
import cv2

# Initialize InsightFace
app = FaceAnalysis(
    name="buffalo_l",
    providers=["CPUExecutionProvider"]  # Use CPU
)

# Load models
app.prepare(ctx_id=0)

# Read image

img = cv2.imread("test_images/group.jpg")

if img is None:
    print("Could not load image.")
    exit()

# Detect faces
faces = app.get(img)

print(f"\nDetected {len(faces)} face(s)\n")

for i, face in enumerate(faces):
    print(f"Face {i+1}")
    print("Bounding Box:", face.bbox)
    print("Embedding Shape:", face.embedding.shape)
    print("-" * 40)