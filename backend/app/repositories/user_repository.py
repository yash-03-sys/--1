from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get(self, id: int):
        return self.db.query(User).filter(User.id == id).first()

    def get_by_email(self, email: str):
        return self.db.query(User).filter(User.email == email).first()
