from sqlalchemy.orm import Session
from app.models.theme import Theme

class ThemeRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_user(self, user_id: int):
        return self.db.query(Theme).filter(Theme.user_id == user_id).first()
