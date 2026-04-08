import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from datetime import datetime
from typing import List

# Using the Pydantic models from your project's document.py
from document import DocumentResponse

router = APIRouter(
    prefix="/api/documents",
    tags=["documents"],
)

# This in-memory list acts as a temporary database for demonstration.
# In a real application, you would interact with a SQL database here.
fake_db: List[DocumentResponse] = []
fake_id_counter = 1

# Load settings from your .env file
UPLOAD_DIRECTORY = os.getenv("UPLOAD_DIR", "data/uploads")
ALLOWED_TYPES_STR = os.getenv("ALLOWED_UPLOAD_TYPES", "application/pdf")
ALLOWED_TYPES = ALLOWED_TYPES_STR.split(',') if ALLOWED_TYPES_STR else []
MAX_SIZE_MB = int(os.getenv("MAX_FILE_SIZE_MB", 50))
MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

@router.on_event("startup")
def on_startup():
    """Ensure the upload directory exists when the server starts."""
    os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

@router.post("/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(file: UploadFile = File(...)):
    """
    Accepts a file upload, saves it locally, and returns the document metadata.
    """
    global fake_id_counter

    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported file type. Allowed types are: {', '.join(ALLOWED_TYPES)}"
        )

    # This is a simple size check. For very large files, a streaming check is better.
    contents = await file.read()
    if len(contents) > MAX_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size exceeds the limit of {MAX_SIZE_MB} MB."
        )
    await file.seek(0) # Reset file pointer after reading

    file_path = os.path.join(UPLOAD_DIRECTORY, file.filename)

    # Save the file securely
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    finally:
        file.file.close()

    # Create a document record. This would be saved to a database.
    new_doc = DocumentResponse(
        id=fake_id_counter,
        owner_id=1, # Faked for demo; would come from logged-in user
        filename=file.filename,
        mime_type=file.content_type,
        file_size_bytes=len(contents),
        status="uploaded",
        processing_progress=0,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    
    fake_db.append(new_doc)
    fake_id_counter += 1
    
    return new_doc

@router.get("/", response_model=List[DocumentResponse])
async def get_recent_documents():
    """
    Returns a list of recently uploaded documents, newest first.
    """
    return sorted(fake_db, key=lambda d: d.created_at, reverse=True)