from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from backend.app.core.config import settings
from typing import AsyncGenerator

# Create an async engine
engine = create_async_engine(settings.DATABASE_URL, echo=settings.APP_DEBUG)

# Create a sessionmaker
AsyncSessionLocal = async_sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False, # Important for keeping objects attached after commit
)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency for getting an async database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()