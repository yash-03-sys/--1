from app.db.session import SessionLocal
from app.models.document import Document, DocumentProcessingJob, DocumentChunk

try:
    from celery import shared_task
except ImportError:
    def shared_task(func):
        return func


@shared_task
def process_document_task(document_id: int):
    db = SessionLocal()
    doc = None
    job = None

    try:
        doc = db.query(Document).filter(Document.id == document_id).first()
        job = db.query(DocumentProcessingJob).filter(DocumentProcessingJob.document_id == document_id).first()

        if not doc or not job:
            return

        job.status = "processing"
        job.progress_percentage = 15.0
        doc.status = "processing"
        db.commit()

        from app.services.pdf_extraction_service import PdfExtractionService
        from app.services.chunking_service import ChunkingService

        extraction_service = PdfExtractionService()
        pages = extraction_service.extract_text(doc.file_path)
        if not pages:
            raise ValueError("No readable text was found in this PDF.")

        job.progress_percentage = 45.0
        db.commit()

        chunking_service = ChunkingService()
        chunks = chunking_service.chunk_text(pages)
        if not chunks:
            raise ValueError("Unable to create search chunks from this PDF.")

        db.query(DocumentChunk).filter(DocumentChunk.document_id == document_id).delete()

        for chunk in chunks:
            db.add(
                DocumentChunk(
                    document_id=document_id,
                    chunk_index=chunk["chunk_index"],
                    content=chunk["content"],
                    page_number=chunk["page_number"],
                )
            )

        job.progress_percentage = 85.0
        db.commit()

        job.status = "ready"
        job.progress_percentage = 100.0
        doc.status = "ready"
        db.commit()
    except Exception as error:
        if job:
            job.status = "failed"
            job.error_message = str(error)
        if doc:
            doc.status = "failed"
        db.commit()
    finally:
        db.close()
