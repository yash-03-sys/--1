import { motion } from 'motion/react';
import { Upload, File, X, CheckCircle2, Clock } from 'lucide-react';
import React, { useState, useCallback } from 'react';
import { cn } from '@/src/utils/cn';
import { useUIStore } from '@/src/app/store/uiStore';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  time: string;
  status: 'uploading' | 'completed';
}

export const UploadPanel = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { setActiveView } = useUIStore();

  const handleUpload = () => {
    // Simulate upload
    const newFile: UploadedFile = {
      id: Math.random().toString(),
      name: 'New_Document.pdf',
      size: '1.2 MB',
      type: 'PDF',
      time: 'Just now',
      status: 'completed'
    };
    setFiles([newFile, ...files]);
    
    // Switch to chat after a short delay
    setTimeout(() => {
      setActiveView('chat');
    }, 1000);
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleUpload();
  }, [files]);

  return (
    <div className="w-full max-w-4xl mx-auto p-8 space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-serif font-medium text-text-primary">Knowledge Base</h2>
        <p className="text-text-secondary">Upload documents to create a focused research context.</p>
      </div>

      {/* Dropzone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "relative h-64 premium-card flex flex-col items-center justify-center gap-4 border-2 border-dashed transition-all duration-300",
          isDragging ? "border-brand-primary bg-brand-primary/5 scale-[1.01]" : "border-border-soft hover:border-brand-primary/50"
        )}
      >
        <div className="w-16 h-16 rounded-full bg-surface-main flex items-center justify-center text-brand-primary stitch-border">
          <Upload size={32} />
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-text-primary">Click or drag files to upload</p>
          <p className="text-sm text-text-muted">PDF, DOCX, TXT up to 50MB</p>
        </div>
        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" multiple />
      </div>

      {/* File List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted">Uploaded Documents</h3>
        {files.length === 0 ? (
          <div className="text-center py-12 premium-card">
            <p className="text-text-muted">No documents uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {files.map((file) => (
              <motion.div
                key={file.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="premium-card p-4 flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-surface-main flex items-center justify-center text-brand-primary">
                  <File size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text-primary truncate">{file.name}</p>
                  <div className="flex items-center gap-3 text-[10px] text-text-muted mt-1">
                    <span className="bg-surface-main px-2 py-0.5 rounded-md font-bold text-brand-primary">{file.type}</span>
                    <span>{file.size}</span>
                    <span className="flex items-center gap-1"><Clock size={10} /> {file.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-green-500" />
                  <button className="p-2 text-text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                    <X size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
