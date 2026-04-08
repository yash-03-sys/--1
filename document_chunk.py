from sqlalchemy import String, ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.db.base import Base

class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    document_id: Mapped[int] = mapped_column(ForeignKey("documents.id"))
    chunk_index: Mapped[int] = mapped_column(Integer)
    page_number: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    content: Mapped[str] = mapped_column(Text)
    # embeddings will be stored in vector DB, not directly here, but we might store a reference or flag
    # embedding_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    # Relationships
    document: Mapped["Document"] = relationship(back_populates="chunks")