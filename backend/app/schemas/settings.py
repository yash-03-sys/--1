from pydantic import BaseModel

class ThemeUpdateRequest(BaseModel):
    theme: str # 'dark black', 'white', 'grey', 'premium'

class SettingsResponse(BaseModel):
    theme: str
