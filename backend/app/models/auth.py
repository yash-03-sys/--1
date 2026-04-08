from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from app.db.base import Base

class AuthSession(Base):
    __tablename__ = "auth_sessions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    refresh_token = Column(String, index=True)
