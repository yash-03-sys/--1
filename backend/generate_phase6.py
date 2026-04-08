import os

backend_dir = r"c:\Users\STAR SUPER MARKET\Documents\--1\backend"

files_to_write = {
    "app/api/routes/notes.py": """from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.models.note import Note
from app.schemas.note import NoteCreate, NoteUpdate, NoteResponse

router = APIRouter()

@router.post("", response_model=NoteResponse)
def create_note(
    request: NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    note = Note(
        user_id=current_user.id,
        title=request.title,
        content=request.content,
        document_id=request.document_id
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return note

@router.get("", response_model=List[NoteResponse])
def get_notes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notes = db.query(Note).filter(Note.user_id == current_user.id).order_by(Note.updated_at.desc()).all()
    return notes

@router.get("/{note_id}", response_model=NoteResponse)
def get_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    note = db.query(Note).filter(Note.id == note_id, Note.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@router.put("/{note_id}", response_model=NoteResponse)
def update_note(
    note_id: int,
    request: NoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    note = db.query(Note).filter(Note.id == note_id, Note.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
        
    if request.title is not None:
        note.title = request.title
    if request.content is not None:
        note.content = request.content
        
    db.commit()
    db.refresh(note)
    return note

@router.post("/{note_id}/autosave", response_model=NoteResponse)
def autosave_note(
    note_id: int,
    request: NoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Same logic as update, designed for polling
    return update_note(note_id, request, db, current_user)
""",
    "app/api/routes/settings.py": """from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.models.user_settings import UserSettings
from app.schemas.settings import SettingsResponse, ThemeUpdateRequest

router = APIRouter()

@router.get("", response_model=SettingsResponse)
def get_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if not settings:
        settings = UserSettings(user_id=current_user.id, theme="dark black")
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return {"theme": settings.theme}

@router.put("/theme", response_model=SettingsResponse)
def update_theme(
    request: ThemeUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    valid_themes = ["dark black", "white", "grey", "premium"]
    if request.theme not in valid_themes:
        raise HTTPException(status_code=400, detail=f"Invalid theme. Must be one of {valid_themes}")
        
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if not settings:
        settings = UserSettings(user_id=current_user.id, theme=request.theme)
        db.add(settings)
    else:
        settings.theme = request.theme
        
    db.commit()
    return {"theme": settings.theme}
""",
    "app/api/routes/health.py": """from fastapi import APIRouter

router = APIRouter()

@router.get("")
def health_check():
    return {"status": "healthy", "version": "1.0.0"}
"""
}

for rel_path, content in files_to_write.items():
    full_path = os.path.join(backend_dir, rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Phase 6 setup completed.")
