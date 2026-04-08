import sys
from loguru import logger
from backend.app.core.config import settings

# Remove default logger
logger.remove()

# Add a new logger with custom format and level from settings
logger.add(
    sys.stderr,
    level=settings.LOG_LEVEL,
    format="{time} {level} {message}",
)