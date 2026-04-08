class ChunkingService:
    def chunk_text(self, pages: list[dict], chunk_size: int = 1200, overlap: int = 150) -> list[dict]:
        chunks: list[dict] = []

        for page in pages:
            text = page["text"]
            start = 0
            chunk_index = 0

            while start < len(text):
                end = min(len(text), start + chunk_size)
                chunk_text = text[start:end].strip()
                if chunk_text:
                    chunks.append(
                        {
                            "page_number": page["page_number"],
                            "chunk_index": chunk_index,
                            "content": chunk_text,
                        }
                    )
                    chunk_index += 1

                if end == len(text):
                    break

                start = max(0, end - overlap)

        return chunks
