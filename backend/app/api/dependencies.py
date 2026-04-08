from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.core.config import settings
from app.db.session import get_db
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)
GUEST_USER_EMAIL = "guest@local.app"
GUEST_USER_NAME = "Guest User"


def _get_or_create_guest_user(db: Session) -> User:
    user = db.query(User).filter(User.email == GUEST_USER_EMAIL).first()
    if user:
        return user

    user = User(
        email=GUEST_USER_EMAIL,
        name=GUEST_USER_NAME,
        picture=None,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> User:
    if not token:
        return _get_or_create_guest_user(db)
    
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return _get_or_create_guest_user(db)
    
    return user
