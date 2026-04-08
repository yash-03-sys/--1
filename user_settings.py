from sqlalchemy import String, ForeignKey, Enum as SQLEnum, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.db.base import Base
from typing import Literal

ThemeOption = Literal["dark_black", "white", "grey", "midnight_purple"]

class UserSettings(Base):
    __tablename__ = "user_settings"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)
    theme: Mapped[ThemeOption] = mapped_column(SQLEnum(*ThemeOption.__args__), default="dark_black")
    notifications_enabled: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relationships
    user: Mapped["User"] = relationship(back_populates="settings")