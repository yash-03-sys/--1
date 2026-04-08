from sqlalchemy import Column, Integer, String, ForeignKey, Text
from app.db.base import Base

class DocumentChunk(Base):
    __tablename__ = "document_chunks"
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"))
    content = Column(Text)
    page_number = Column(Integer)
