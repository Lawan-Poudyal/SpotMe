import asyncio
from fastapi import APIRouter, Depends
from app.core.auth import verify_internal_key
from concurrent.futures import ThreadPoolExecutor
from app.models.schemas import (
    PhotoBatchRequest, PhotoBatchResponse, PhotoResult, PhotoInput,
    SelfieRequest, SelfieResponse
)
from app.services.detector import download_image, detect_faces
from app.services.embedding import extract_embeddings

router = APIRouter(dependencies=[Depends(verify_internal_key)])

# Thread pool for CPU-bound face detection 
executor = ThreadPoolExecutor(max_workers=4)

async def process_single_photo(photo, event_id:str) -> PhotoResult:
    try:
        img = await download_image(photo.url)
    except Exception as e:
        return PhotoResult(photo_id = photo.photo_id, status="error", error=f"download_failed: {str(e)}")

    try:
        loop = asyncio.get_event_loop()
        faces = await loop.run_in_executor(executor, detect_faces, img)
    except Exception as e:
        return PhotoResult(photo_id=photo.photo_id, status="error", error=f"detection_failed: {str(e)}")

    if not faces:
        return PhotoResult(photo_id = photo.photo_id, status = "no_faces")

    embeddings = extract_embeddings(faces)

    return PhotoResult(photo_id = photo.photo_id, status = "success", faces=embeddings)


@router.post("/embeddings/photo-batch", response_model=PhotoBatchResponse)
async def process_photo_batch(request: PhotoBatchRequest):
    # process all photos in the batch concurrently
    tasks = [process_single_photo(photo, request.event_id) for photo in request.photos]
    results =  await asyncio.gather(*tasks)
    return PhotoBatchResponse(event_id= request.event_id, results = results)

@router.post("/embeddings/selfie", response_model=SelfieResponse)
async def process_selfie(request: SelfieRequest):
    try:
        img = await download_image(request.url)
    except Exception as e:
        return SelfieResponse(participant_id = request.participant_id, status="error", error = f"download_failed: {str(e)}")
    
    try: 
        loop = asyncio.get_event_loop()
        faces = await loop.run_in_executor(executor, detect_faces, img)
    except Exception as e:
        return SelfieResponse(participant_id = request.participant_id, status="error", error=f"detection_failed: {str(e)}")
    
    if not faces:
        return SelfieResponse(participant_id = request.participant_id, status="error", error = "no_faces_detected")
    
    if len(faces) >1:
        # choosing largest face rather than failing
        faces = [max(faces, key=lambda f: (f.bbox[2] - f.bbox[0]) * (f.bbox[3] - f.bbox[1]))]

    embedding = extract_embeddings(faces)[0]

    return SelfieResponse(
        participant_id = request.participant_id,
        status="success",
        embedding= embedding.embedding
    )    

@router.post("/embeddings/photo", response_model = PhotoResult)
async def process_photo(photo: PhotoInput , event_id:str =""):
    return await process_single_photo(photo, event_id)