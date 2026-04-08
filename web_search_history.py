from sqlalchemy import String, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.db.base import Base
from typing import Optional

class WebSearchHistory(Base):
    __tablename__ = "web_search_history"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    query: Mapped[str] = mapped_column(String)
    results_json: Mapped[str] = mapped_column(Text) # Store results as JSON string
    document_id: Mapped[Optional[int]] = mapped_column(ForeignKey("documents.id"), nullable=True) # Contextual search

    # Relationships
    user: Mapped["User"] = relationship(back_populates="web_search_history") # Assuming User model has this back_populates
    document: Mapped[Optional["Document"]] = relationship(back_populates="web_search_history") # Assuming Document model has this back_populates