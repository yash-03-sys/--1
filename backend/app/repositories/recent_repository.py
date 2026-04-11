from sqlalchemy.orm import Session
from app.models.recent import Recent

class RecentRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_user(self, user_id: int):
        return self.db.query(Recent).filter(Recent.user_id == user_id).all()
