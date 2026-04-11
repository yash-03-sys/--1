from sqlalchemy.orm import Session
from app.models.chat import Chat

class ChatRepository:
    def __init__(self, db: Session):
        self.db = db

    def get(self, id: int):
        return self.db.query(Chat).filter(Chat.id == id).first()
