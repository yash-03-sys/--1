from pydantic import BaseModel, Field
from backend.app.schemas.user import UserResponse

class GoogleLoginRequest(BaseModel):
    id_token: str = Field(..., description="Google ID token received from the frontend.")

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    refresh_token: Optional[str] = None

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse