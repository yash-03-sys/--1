from fastapi import APIRouter, Depends, HTTPException
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

@router.get("/document/{document_id}", response_model=NoteResponse | None)
def get_note_for_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    note = db.query(Note).filter(
        Note.document_id == document_id,
        Note.user_id == current_user.id
    ).order_by(Note.updated_at.desc().nullslast(), Note.id.desc()).first()
    return note

@router.put("/document/{document_id}", response_model=NoteResponse)
def upsert_note_for_document(
    document_id: int,
    request: NoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    note = db.query(Note).filter(
        Note.document_id == document_id,
        Note.user_id == current_user.id
    ).order_by(Note.updated_at.desc().nullslast(), Note.id.desc()).first()

    title = request.title or "Research Notes"
    content = request.content or ""

    if note:
        note.title = title
        note.content = content
    else:
        note = Note(
            user_id=current_user.id,
            document_id=document_id,
            title=title,
            content=content,
        )
        db.add(note)

    db.commit()
    db.refresh(note)
    return note

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
