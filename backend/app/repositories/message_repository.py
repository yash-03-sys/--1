from sqlalchemy.orm import Session
from app.models.message import Message

class MessageRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, chat_id: int, role: str, content: str):
        db_obj = Message(chat_id=chat_id, role=role, content=content)
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj
