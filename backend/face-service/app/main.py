from fastapi import FastAPI
from app.api.face import router as face_router

app = FastAPI(
    title="SpotMe Face Service",
    version="1.0.0"
)

app.include_router(face_router)

@app.get("/")
def root():
    return {
        "message": "SpotMe Face Service Running"
    }