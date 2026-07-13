import os
from fastapi import Header, HTTPException

INTERNAL_API_KEY = os.environ.get("INTERTNAL_API_KEY")

async def verify_internal_key(x_internal_key: str = Header(...)):
    if not INTERNAL_API_KEY or x_internal_key != INTERNAL_API_KEY:
        raise HTTPException(status_code = 401, detail = "unauthorized")