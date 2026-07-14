from fastapi import FastAPI

from dotenv import load_dotenv
load_dotenv()   


from app.api.face import router as face_router

from app.core.insightface_client import insightface_client

app = FastAPI(
    title="SpotMe Face Service"
)

# forcing model to load on startup, not on first request
@app.on_event("startup")
async def startup_event():
    insightface_client.get_app()

app.include_router(face_router, prefix="/api", tags=["face"])

@app.get("/health")
async def health():
    return {
        "status" : "ok"
    }