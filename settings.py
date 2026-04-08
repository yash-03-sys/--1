from pydantic import BaseModel, Field
from typing import Literal, Optional
from datetime import datetime

ThemeOption = Literal["dark_black", "white", "grey", "midnight_purple"]

class UserSettingsBase(BaseModel):
    theme: ThemeOption = "dark_black"
    notifications_enabled: bool = True

class UserSettingsUpdate(BaseModel):
    theme: Optional[ThemeOption] = None
    notifications_enabled: Optional[bool] = None

class UserSettingsResponse(UserSettingsBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True