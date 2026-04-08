class PdfExtractionService:
    def extract_text(self, file_path: str) -> list[dict]:
        try:
            from pypdf import PdfReader
        except ImportError as error:
            raise RuntimeError("PDF extraction dependency is missing. Install 'pypdf' to process uploaded documents.") from error

        pages: list[dict] = []

        reader = PdfReader(file_path)
        for index, page in enumerate(reader.pages, start=1):
            text = (page.extract_text() or "").strip()
            if text:
                pages.append({"page_number": index, "text": text})

        return pages
