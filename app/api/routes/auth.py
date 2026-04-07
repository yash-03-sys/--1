from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.api import dependencies
from app.core import security
from app.db.database import get_db

router = APIRouter()

@router.post("/login")
async def login(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    # Mock login logic
    return {"access_token": "mock_token", "token_type": "bearer"}

@router.get("/me")
async def read_users_me(current_user: str = Depends(dependencies.get_current_user)):
    return {"user_id": current_user}
