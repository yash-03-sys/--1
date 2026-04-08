from sqlalchemy.orm import Session
from app.models.document import DocumentChunk

class RetrievalService:
    def __init__(self, db: Session):
        self.db = db

    def retrieve_context(self, query: str, document_id: int, top_k: int = 3) -> list:
        chunks = self.db.query(DocumentChunk).filter(DocumentChunk.document_id == document_id).all()

        if not chunks:
            return []

        query_terms = {term for term in query.lower().split() if len(term) > 2}
        ranked_chunks = []

        for chunk in chunks:
            content_lower = chunk.content.lower()
            score = sum(content_lower.count(term) for term in query_terms)
            ranked_chunks.append((score, chunk))

        ranked_chunks.sort(
            key=lambda item: (
                item[0],
                -item[1].page_number if item[1].page_number is not None else 0,
                -item[1].chunk_index if item[1].chunk_index is not None else 0,
            ),
            reverse=True,
        )

        selected = [chunk for score, chunk in ranked_chunks if score > 0][:top_k]
        if not selected:
            selected = chunks[:top_k]

        return [
            {
                "content": chunk.content,
                "page_number": chunk.page_number,
                "chunk_index": chunk.chunk_index,
            }
            for chunk in selected
        ]
