from sqlalchemy import Column, Integer, String, ForeignKey, Text
from app.db.base import Base

class WebSearchHistory(Base):
    __tablename__ = "web_search_history"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    query = Column(String)
    results = Column(Text)
