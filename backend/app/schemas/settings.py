from pydantic import BaseModel

class UserSettingsUpdate(BaseModel):
    theme: str
    notifications_enabled: bool
