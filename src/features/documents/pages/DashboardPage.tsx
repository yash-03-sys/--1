import { useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { motion } from 'motion/react';
import { Upload, FileText, Clock, Plus, Search, MoreVertical, Loader2, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Navbar } from '@/src/components/common/Navbar';
import { Footer } from '@/src/components/common/Footer';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { cn } from '@/src/utils/cn';
import { fetchDocuments, uploadDocument, type DocumentRecord } from '@/src/lib/api';

function formatSize(fileSize?: number | null) {
  if (!fileSize || fileSize <= 0) {
    return '0 KB';
  }

  if (fileSize < 1024 * 1024) {
    return `${Math.max(1, Math.round(fileSize / 1024))} KB`;
  }

  return `${(fileSize / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DashboardPage() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadDocuments() {
    setIsLoading(true);
    setLoadError(null);

    try {
      const response = await fetchDocuments();
      setDocuments(response);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Unable to load recent uploads.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadDocuments();
  }, []);

  async function handleSelectedFile(file: File | null) {
    if (!file) {
      return;
    }

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setUploadError('Please upload a PDF file.');
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const uploaded = await uploadDocument(file);
      setDocuments((current) => [uploaded, ...current.filter((doc) => doc.id !== uploaded.id)]);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    void handleSelectedFile(event.target.files?.[0] ?? null);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragActive(false);
    void handleSelectedFile(event.dataTransfer.files?.[0] ?? null);
  }

  const filteredDocuments = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return documents;
    }

    return documents.filter((document) => document.filename.toLowerCase().includes(query));
  }, [documents, searchTerm]);

  return (
    <div className="min-h-screen bg-bg-dark pt-28 px-6 pb-12">
      <Navbar />

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleInputChange}
        className="hidden"
      />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Workspace</h1>
            <p className="text-gray-400">Manage your documents and research projects.</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search documents..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-purple/50 transition-colors"
              />
            </div>
            <Button variant="primary" size="sm" className="p-3" onClick={() => fileInputRef.current?.click()}>
              <Plus size={24} />
            </Button>
          </div>
        </div>

        {uploadError && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-200 flex items-start gap-3">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card
              whileHover={{ scale: 1.01 }}
              padding="lg"
              className={cn(
                'border-dashed border-2 cursor-pointer group relative overflow-hidden transition-colors',
                isDragActive ? 'border-brand-purple/70' : 'border-white/10 hover:border-brand-purple/50',
              )}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragActive(true);
              }}
              onDragLeave={() => setIsDragActive(false)}
              onDrop={handleDrop}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-20 h-20 rounded-3xl bg-brand-purple/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform purple-glow">
                  <Upload className="text-brand-purple" size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-3">Upload Research Material</h2>
                <p className="text-gray-400 max-w-sm mx-auto mb-8">
                  Drag and drop your PDF here or click to choose a file from your device.
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
                  <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">PDF</span>
                </div>
              </div>

              {isUploading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-bg-dark/90 backdrop-blur-sm flex flex-col items-center justify-center p-12 z-20"
                >
                  <div className="w-full max-w-md space-y-6">
                    <div className="flex justify-between items-end">
                      <div>
                        <h3 className="text-xl font-bold mb-1">Uploading...</h3>
                        <p className="text-sm text-gray-400">Saving and processing your PDF</p>
                      </div>
                      <Loader2 className="text-brand-purple animate-spin" size={28} />
                    </div>
                    <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full w-full bg-brand-purple purple-glow"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </Card>

            <Card padding="none" className="overflow-hidden">
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <Clock size={20} className="text-brand-purple" />
                  Recent Documents
                </h2>
                <button className="text-sm text-brand-purple hover:underline font-medium" onClick={() => void loadDocuments()}>
                  Refresh
                </button>
              </div>

              {isLoading ? (
                <div className="px-8 py-16 flex justify-center">
                  <Loader2 className="animate-spin text-brand-purple" size={28} />
                </div>
              ) : loadError ? (
                <div className="px-8 py-12 text-sm text-red-200">{loadError}</div>
              ) : filteredDocuments.length === 0 ? (
                <div className="px-8 py-16 text-center">
                  <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-brand-purple">
                    <FileText size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No uploads yet</h3>
                  <p className="text-gray-400 max-w-sm mx-auto">
                    Your recent uploads will appear here after you add your first PDF.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs text-gray-500 uppercase tracking-widest border-b border-white/5">
                        <th className="px-8 py-4 font-medium">Name</th>
                        <th className="px-8 py-4 font-medium">Date</th>
                        <th className="px-8 py-4 font-medium">Size</th>
                        <th className="px-8 py-4 font-medium">Status</th>
                        <th className="px-8 py-4 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDocuments.map((doc) => (
                        <tr key={doc.id} className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                          <td className="px-8 py-5">
                            <Link to={`/workspace/${doc.id}`} className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple group-hover:scale-110 transition-transform">
                                <FileText size={20} />
                              </div>
                              <span className="font-medium group-hover:text-brand-purple transition-colors">{doc.filename}</span>
                            </Link>
                          </td>
                          <td className="px-8 py-5 text-sm text-gray-400">
                            {formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })}
                          </td>
                          <td className="px-8 py-5 text-sm text-gray-400 font-mono">{formatSize(doc.file_size)}</td>
                          <td className="px-8 py-5">
                            <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-green-500/20">
                              {doc.status}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <button className="text-gray-500 hover:text-white transition-colors" aria-label={`Open ${doc.filename}`}>
                              <MoreVertical size={20} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-8">
            <Card padding="md">
              <h3 className="text-lg font-bold mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple group-hover:scale-110 transition-transform">
                    <Plus size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-sm">Upload PDF</div>
                    <div className="text-xs text-gray-500">Add a new research document</div>
                  </div>
                </button>
                <Link to="/" className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all text-left group">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                    <Search size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-sm">Explore Landing</div>
                    <div className="text-xs text-gray-500">Review the product overview</div>
                  </div>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
