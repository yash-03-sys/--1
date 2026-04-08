import os
import shutil
from pathlib import Path
from fastapi import UploadFile
from app.core.config import settings

class FileStorageService:
    def __init__(self):
        self.upload_dir = os.path.abspath(settings.UPLOAD_DIR)
        os.makedirs(self.upload_dir, exist_ok=True)

    def save_file(self, file: UploadFile, user_id: int) -> str:
        # Create user specific folder
        user_dir = os.path.join(self.upload_dir, str(user_id))
        os.makedirs(user_dir, exist_ok=True)
        
        original_name = Path(file.filename or "upload.pdf").name
        file_path = os.path.join(user_dir, original_name)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        return file_path
        
    def delete_file(self, file_path: str):
        if os.path.exists(file_path):
            os.remove(file_path)
