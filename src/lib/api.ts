import api from './axios';

export interface DocumentRecord {
  id: number;
  filename: string;
  status: string;
  file_size?: number | null;
  created_at: string;
}

export interface NoteRecord {
  id: number;
  title: string;
  content: string;
  document_id?: number | null;
  updated_at: string;
}

export interface CitationRecord {
  page?: number;
  text?: string;
  title?: string;
  url?: string;
}

export interface SearchResultRecord {
  title: string;
  snippet: string;
  source_url: string;
  source_type: string;
  thumbnail?: string | null;
}

export interface SearchResponseRecord {
  query: string;
  results: SearchResultRecord[];
}

export interface SourceMapNode {
  id: string;
  label: string;
  group: string;
  summary?: string;
  references?: string[];
}

export interface SourceMapLink {
  source: string;
  target: string;
}

export interface SourceMapResponseRecord {
  topic: string;
  graph_data: {
    nodes: SourceMapNode[];
    links: SourceMapLink[];
  };
}

export interface ChatReply {
  reply: string;
  session_id: number;
  citations?: CitationRecord[];
}

export interface ChatMessageRecord {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  citations: CitationRecord[];
  created_at: string;
}

export async function fetchDocuments() {
  const response = await api.get<DocumentRecord[]>('/documents');
  return response.data;
}

export async function fetchDocument(documentId: number) {
  const response = await api.get<DocumentRecord>(`/documents/${documentId}`);
  return response.data;
}

export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<DocumentRecord>('/documents/upload', formData);
  return response.data;
}

export async function askDocumentQuestion(payload: {
  message: string;
  document_id: number;
  session_id?: number | null;
  use_web_search?: boolean;
}) {
  const response = await api.post<ChatReply>('/chat/ask', {
    use_web_search: false,
    ...payload,
  });
  return response.data;
}

export async function fetchChatMessages(sessionId: number) {
  const response = await api.get<ChatMessageRecord[]>(`/chat/sessions/${sessionId}/messages`);
  return response.data;
}

export async function fetchDocumentNote(documentId: number) {
  const response = await api.get<NoteRecord | null>(`/notes/document/${documentId}`);
  return response.data;
}

export async function saveDocumentNote(documentId: number, payload: { title: string; content: string }) {
  const response = await api.put<NoteRecord>(`/notes/document/${documentId}`, payload);
  return response.data;
}

export async function searchWeb(query: string) {
  const response = await api.post<SearchResponseRecord>('/search/web', { query });
  return response.data;
}

export async function generateSourceMap(payload: { topic: string; document_id: number }) {
  const response = await api.post<SourceMapResponseRecord>('/source-map/generate', payload);
  return response.data;
}
