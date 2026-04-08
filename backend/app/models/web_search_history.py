from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from app.db.base import Base

class WebSearchHistory(Base):
    __tablename__ = "web_search_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    query = Column(String, nullable=False)
    results = Column(Text) # JSON serialized
    created_at = Column(DateTime(timezone=True), server_default=func.now())
