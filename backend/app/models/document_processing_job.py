from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from app.db.base import Base

class DocumentProcessingJob(Base):
    __tablename__ = "document_processing_jobs"
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"))
    status = Column(String) # pending, processing, completed, failed
