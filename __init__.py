# This file ensures all schemas are imported for easier access.
from backend.app.schemas.user import UserBase, UserCreate, UserResponse # noqa
from backend.app.schemas.auth import Token, GoogleLoginRequest # noqa
from backend.app.schemas.document import DocumentBase, DocumentUploadRequest, DocumentResponse, DocumentStatusResponse # noqa
from backend.app.schemas.chat import ChatMessageBase, ChatMessageResponse, ChatSessionBase, ChatSessionResponse, ChatRequest # noqa
from backend.app.schemas.note import NoteBase, NoteCreate, NoteResponse, NoteUpdate, NoteAutosave # noqa
from backend.app.schemas.search import WebSearchResult, WebSearchRequest # noqa
from backend.app.schemas.source_map import SourceMapNode, SourceMapEdge, SourceMapResponse, SourceMapGenerateRequest # noqa
from backend.app.schemas.settings import UserSettingsBase, UserSettingsUpdate, UserSettingsResponse # noqa