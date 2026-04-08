from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.auth import GoogleAuthRequest, TokenResponse
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService
from app.api.dependencies import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/google", response_model=TokenResponse)
def google_auth(request: GoogleAuthRequest, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    return auth_service.authenticate_google_user(request)

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/logout")
def logout():
    # Client-side logout usually handles removing the token,
    # but we provide this endpoint for completeness/future blacklisting.
    return {"message": "Successfully logged out"}
