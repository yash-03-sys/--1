from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from app.db.base import Base

class UserSettings(Base):
    __tablename__ = "user_settings"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    theme = Column(String, default="dark")
    notifications_enabled = Column(Boolean, default=True)
