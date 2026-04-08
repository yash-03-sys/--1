from sqlalchemy.orm import Session
from fastapi import HTTPException
from google.oauth2 import id_token
from google.auth.transport import requests
from app.models.user import User
from app.models.user_settings import UserSettings
from app.core.config import settings
from app.schemas.auth import GoogleAuthRequest, TokenResponse
from app.core.security import create_access_token
import httpx

class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def verify_google_token_mock(self, token: str) -> dict:
        # Since we might not have a real client ID yet, fallback to a simple mock or 
        # actual verification if settings.GOOGLE_CLIENT_ID is present
        if not settings.GOOGLE_CLIENT_ID:
            # Fallback for local development
            return {
                "email": "testuser@example.com",
                "name": "Test User",
                "picture": "https://example.com/pic.jpg",
                "sub": "1234567890"
            }
        
        try:
            idinfo = id_token.verify_oauth2_token(
                token, requests.Request(), settings.GOOGLE_CLIENT_ID
            )
            return idinfo
        except ValueError:
            raise HTTPException(status_code=401, detail="Invalid Google token")

    def authenticate_google_user(self, auth_request: GoogleAuthRequest) -> TokenResponse:
        idinfo = self.verify_google_token_mock(auth_request.id_token)
        
        email = idinfo.get("email")
        name = idinfo.get("name")
        picture = idinfo.get("picture")
        
        if not email:
            raise HTTPException(status_code=400, detail="Email not provided by Google")

        user = self.db.query(User).filter(User.email == email).first()
        if not user:
            user = User(email=email, name=name, picture=picture)
            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)
            
            # Initialize default settings for new user
            user_settings = UserSettings(user_id=user.id, theme="dark black")
            self.db.add(user_settings)
            self.db.commit()
        
        access_token = create_access_token(subject=user.id)
        return TokenResponse(access_token=access_token)
