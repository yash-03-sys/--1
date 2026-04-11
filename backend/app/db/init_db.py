from sqlalchemy.orm import Session
from app.db import base  # noqa: F401

def init_db(db: Session) -> None:
    # Tables should be created with Alembic migrations
    # But if you don't want to use alembic, you can use base.Base.metadata.create_all(bind=engine)
    pass
