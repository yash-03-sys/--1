from sqlalchemy import String, ForeignKey, Enum as SQLEnum, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.db.base import Base
from typing import Literal

ProcessingJobStatus = Literal["queued", "extracting_text", "chunking", "embedding", "completed", "failed"]

class DocumentProcessingJob(Base):
    __tablename__ = "document_processing_jobs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    document_id: Mapped[int] = mapped_column(ForeignKey("documents.id"))
    status: Mapped[ProcessingJobStatus] = mapped_column(SQLEnum(*ProcessingJobStatus.__args__), default="queued")
    progress: Mapped[int] = mapped_column(Integer, default=0) # 0-100
    current_step: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    error_message: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    celery_task_id: Mapped[Optional[str]] = mapped_column(String, unique=True, nullable=True)

    # Relationships
    document: Mapped["Document"] = relationship(back_populates="processing_jobs")