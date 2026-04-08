from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.models.user_settings import UserSettings
from app.schemas.settings import SettingsResponse, ThemeUpdateRequest

router = APIRouter()

@router.get("", response_model=SettingsResponse)
def get_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if not settings:
        settings = UserSettings(user_id=current_user.id, theme="dark black")
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return {"theme": settings.theme}

@router.put("/theme", response_model=SettingsResponse)
def update_theme(
    request: ThemeUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    valid_themes = ["dark black", "white", "grey", "premium"]
    if request.theme not in valid_themes:
        raise HTTPException(status_code=400, detail=f"Invalid theme. Must be one of {valid_themes}")
        
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if not settings:
        settings = UserSettings(user_id=current_user.id, theme=request.theme)
        db.add(settings)
    else:
        settings.theme = request.theme
        
    db.commit()
    return {"theme": settings.theme}
