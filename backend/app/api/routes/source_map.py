from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_source_map():
    return {}
