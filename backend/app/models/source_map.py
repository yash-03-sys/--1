from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from app.db.base import Base

class SourceMap(Base):
    __tablename__ = "source_maps"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    topic = Column(String, nullable=False)
    graph_data = Column(Text) # JSON serialized
    created_at = Column(DateTime(timezone=True), server_default=func.now())
