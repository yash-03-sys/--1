from sqlalchemy import Column, Integer, String, ForeignKey, Text
from app.db.base import Base

class SourceMap(Base):
    __tablename__ = "source_maps"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    data = Column(Text)
