from sqlalchemy.orm import Session
from app.models.note import Note

class NoteRepository:
    def __init__(self, db: Session):
        self.db = db

    def get(self, id: int):
        return self.db.query(Note).filter(Note.id == id).first()
