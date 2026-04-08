import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  Search,
  MessageSquare,
  Globe,
  Layers,
  ChevronLeft,
  Save,
  MoreHorizontal,
  Plus,
  ExternalLink,
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
  Loader2,
  AlertTriangle,
  Map,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/src/utils/cn';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import {
  askDocumentQuestion,
  fetchChatMessages,
  fetchDocument,
  fetchDocumentNote,
  generateSourceMap,
  saveDocumentNote,
  searchWeb,
  type ChatMessageRecord,
  type CitationRecord,
  type DocumentRecord,
  type NoteRecord,
  type SearchResultRecord,
} from '@/src/lib/api';

type Tab = 'chat' | 'research' | 'sources';
type ChatMode = 'document' | 'hybrid';

const EMPTY_NOTE_CONTENT = 'Start writing your research notes here...';

function extractErrorMessage(error: unknown) {
  if (typeof error === 'object' && error && 'response' in error) {
    const response = (error as { response?: { data?: { detail?: string } } }).response;
    if (response?.data?.detail) {
      return response.data.detail;
    }
  }
  return error instanceof Error ? error.message : 'Something went wrong.';
}

export default function WorkspacePage() {
  const params = useParams();
  const navigate = useNavigate();
  const documentId = Number(params.documentId);
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [chatMode, setChatMode] = useState<ChatMode>('document');
  const [document, setDocument] = useState<DocumentRecord | null>(null);
  const [messages, setMessages] = useState<ChatMessageRecord[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatError, setChatError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [note, setNote] = useState<NoteRecord | null>(null);
  const [noteTitle, setNoteTitle] = useState('Research Notes');
  const [noteContent, setNoteContent] = useState(EMPTY_NOTE_CONTENT);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [researchQuery, setResearchQuery] = useState('');
  const [researchResults, setResearchResults] = useState<SearchResultRecord[]>([]);
  const [researchError, setResearchError] = useState<string | null>(null);
  const [isResearchLoading, setIsResearchLoading] = useState(false);
  const [isGeneratingMap, setIsGeneratingMap] = useState(false);
  const saveTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!Number.isFinite(documentId)) {
      setPageError('This workspace link is invalid.');
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function loadWorkspace() {
      setIsLoading(true);
      setPageError(null);
      try {
        const [documentResponse, noteResponse] = await Promise.all([
          fetchDocument(documentId),
          fetchDocumentNote(documentId),
        ]);
        if (!isMounted) return;
        setDocument(documentResponse);
        setNote(noteResponse);
        setNoteTitle(noteResponse?.title || 'Research Notes');
        setNoteContent(noteResponse?.content || EMPTY_NOTE_CONTENT);
        setResearchQuery(documentResponse.filename.replace(/\.pdf$/i, ''));
        setStatusMessage(
          documentResponse.status === 'ready'
            ? null
            : 'This document is still processing. Questions and source mapping will work once processing finishes.',
        );
      } catch (error) {
        if (isMounted) setPageError(extractErrorMessage(error));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadWorkspace();
    return () => {
      isMounted = false;
    };
  }, [documentId]);

  useEffect(() => {
    if (!sessionId) return;
    void fetchChatMessages(sessionId).then(setMessages).catch(() => undefined);
  }, [sessionId]);

  useEffect(() => {
    if (!document || isLoading) return;
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(() => {
      void persistNote();
    }, 1200);
    return () => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    };
  }, [noteTitle, noteContent, document, isLoading]);

  useEffect(() => {
    if (!researchQuery.trim()) {
      setResearchResults([]);
      return;
    }
    const timeout = window.setTimeout(() => {
      void runResearchSearch(researchQuery);
    }, 400);
    return () => window.clearTimeout(timeout);
  }, [researchQuery]);

  async function persistNote() {
    if (!document) return;
    const normalizedTitle = noteTitle.trim() || 'Research Notes';
    const normalizedContent = noteContent.trim() || EMPTY_NOTE_CONTENT;
    setIsSaving(true);
    setSaveError(null);
    try {
      const savedNote = await saveDocumentNote(document.id, {
        title: normalizedTitle,
        content: normalizedContent,
      });
      setNote(savedNote);
    } catch (error) {
      setSaveError(extractErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  async function runResearchSearch(query: string) {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      setResearchResults([]);
      return;
    }
    setIsResearchLoading(true);
    setResearchError(null);
    try {
      const response = await searchWeb(normalizedQuery);
      setResearchResults(response.results);
    } catch (error) {
      setResearchError(extractErrorMessage(error));
    } finally {
      setIsResearchLoading(false);
    }
  }

  async function handleSendMessage() {
    if (!document) {
      setChatError('Upload a document before asking questions.');
      return;
    }
    if (document.status !== 'ready') {
      setChatError('This document is still processing. Please wait until it is ready.');
      return;
    }
    const message = chatInput.trim();
    if (!message) return;

    setIsSending(true);
    setChatError(null);
    const optimisticUserMessage: ChatMessageRecord = {
      id: Date.now(),
      role: 'user',
      content: message,
      citations: [],
      created_at: new Date().toISOString(),
    };
    setMessages((current) => [...current, optimisticUserMessage]);
    setChatInput('');

    try {
      const response = await askDocumentQuestion({
        message,
        document_id: document.id,
        session_id: sessionId,
        use_web_search: chatMode === 'hybrid',
      });
      setSessionId(response.session_id);
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: response.reply,
          citations: response.citations || [],
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      setChatError(extractErrorMessage(error));
      setMessages((current) => current.filter((item) => item.id !== optimisticUserMessage.id));
      setChatInput(message);
    } finally {
      setIsSending(false);
    }
  }

  async function handleOpenSourceMap() {
    if (!document) return;
    const topic = researchQuery.trim() || document.filename.replace(/\.pdf$/i, '');
    setIsGeneratingMap(true);
    try {
      await generateSourceMap({ topic, document_id: document.id });
      navigate(`/sourcemap?documentId=${document.id}&topic=${encodeURIComponent(topic)}`);
    } catch (error) {
      setResearchError(extractErrorMessage(error));
    } finally {
      setIsGeneratingMap(false);
    }
  }

  if (isLoading) {
    return <div className="min-h-screen bg-bg-dark flex items-center justify-center"><Loader2 className="animate-spin text-brand-purple" size={32} /></div>;
  }

  if (pageError || !document) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center p-6">
        <Card padding="lg" className="max-w-xl text-center">
          <AlertTriangle className="mx-auto mb-4 text-red-300" size={32} />
          <h1 className="text-2xl font-bold mb-3">Workspace unavailable</h1>
          <p className="text-gray-400 mb-6">{pageError || 'Document not found.'}</p>
          <Link to="/dashboard"><Button>Back to Dashboard</Button></Link>
        </Card>
      </div>
    );
  }

  const citations: CitationRecord[] = messages.filter((message) => message.role === 'assistant').flatMap((message) => message.citations || []).slice(0, 6);
  const combinedSources = useMemo(() => {
    const webLike = citations.filter((citation) => citation.url);
    return webLike.length > 0
      ? webLike
      : researchResults.map((result) => ({ title: result.title, url: result.source_url, text: result.snippet }));
  }, [citations, researchResults]);

  return (
    <div className="h-screen bg-bg-dark flex flex-col overflow-hidden">
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-bg-dark/50 backdrop-blur-xl z-20">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-400 hover:text-white"><ChevronLeft size={20} /></Link>
          <div className="h-6 w-px bg-white/10 mx-2" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-purple/20 flex items-center justify-center text-brand-purple"><FileText size={18} /></div>
            <div>
              <h1 className="text-sm font-bold truncate max-w-[240px]">{document.filename}</h1>
              <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest">
                <Clock size={10} />
                {formatDistanceToNow(new Date(document.created_at), { addSuffix: true })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={cn('flex items-center gap-2 text-xs font-medium transition-opacity duration-500', isSaving ? 'opacity-100' : 'opacity-0')}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-gray-400">Autosaving...</span>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => void handleOpenSourceMap()}>
            {isGeneratingMap ? <Loader2 size={16} className="animate-spin" /> : <Map size={16} />}
            Source Map
          </Button>
          <Button variant="primary" size="sm" glow className="flex items-center gap-2" onClick={() => void persistNote()}>
            <Save size={16} />
            Save Notes
          </Button>
          <button className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-400" aria-label="More options"><MoreHorizontal size={20} /></button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <div className="w-1/2 border-r border-white/5 flex flex-col bg-bg-dark/30">
          <div className="flex items-center gap-1 p-2 bg-white/5 border-b border-white/5">
            <button onClick={() => setActiveTab('chat')} className={cn('flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all', activeTab === 'chat' ? 'bg-brand-purple text-white purple-glow' : 'text-gray-400 hover:bg-white/5 hover:text-white')}><MessageSquare size={16} />Chat</button>
            <button onClick={() => setActiveTab('research')} className={cn('flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all', activeTab === 'research' ? 'bg-brand-purple text-white purple-glow' : 'text-gray-400 hover:bg-white/5 hover:text-white')}><Globe size={16} />Research</button>
            <button onClick={() => setActiveTab('sources')} className={cn('flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all', activeTab === 'sources' ? 'bg-brand-purple text-white purple-glow' : 'text-gray-400 hover:bg-white/5 hover:text-white')}><Layers size={16} />Sources</button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {statusMessage && <Card padding="sm" className="border border-yellow-500/20 bg-yellow-500/10 text-sm text-yellow-100">{statusMessage}</Card>}

            {activeTab === 'chat' && (
              <>
                <div className="flex items-center gap-2">
                  <button onClick={() => setChatMode('document')} className={cn('rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all', chatMode === 'document' ? 'bg-brand-purple text-white' : 'bg-white/5 text-gray-400')}>Document Mode</button>
                  <button onClick={() => setChatMode('hybrid')} className={cn('rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all', chatMode === 'hybrid' ? 'bg-brand-purple text-white' : 'bg-white/5 text-gray-400')}>LLM + Web</button>
                </div>
                <div className="space-y-6">
                  {messages.length === 0 ? (
                    <Card padding="md" className="border-white/5 text-center">
                      <h3 className="text-lg font-bold mb-2">Ask your document anything</h3>
                      <p className="text-sm text-gray-400">Document mode stays grounded in the PDF, and hybrid mode adds web search citations when needed.</p>
                    </Card>
                  ) : messages.map((msg) => (
                    <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn('flex gap-4', msg.role === 'user' ? 'flex-row-reverse' : '')}>
                      <div className={cn('w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold', msg.role === 'assistant' ? 'bg-brand-purple text-white purple-glow' : 'bg-white/10 text-white')}>{msg.role === 'assistant' ? 'AI' : 'U'}</div>
                      <Card padding="sm" className={cn('max-w-[80%] text-sm leading-relaxed', msg.role === 'assistant' ? 'border-brand-purple/20' : 'bg-white/5 border border-white/10')}>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        {msg.citations?.length ? <div className="mt-4 flex flex-wrap gap-2">{msg.citations.map((citation, index) => <span key={`${msg.id}-${index}`} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-widest text-gray-300">{citation.page ? `Page ${citation.page}` : citation.title || 'Source'}</span>)}</div> : null}
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'research' && (
              <div className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input type="text" value={researchQuery} onChange={(event) => setResearchQuery(event.target.value)} placeholder="Search related web information..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-purple/50 transition-colors" />
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" onClick={() => void runResearchSearch(researchQuery)}><Search size={16} />Search Web</Button>
                  <Button variant="primary" size="sm" glow onClick={() => void handleOpenSourceMap()}>{isGeneratingMap ? <Loader2 size={16} className="animate-spin" /> : <Map size={16} />}Build Source Map</Button>
                </div>
                {researchError ? <Card padding="sm" className="border-red-500/20 bg-red-500/10 text-sm text-red-200">{researchError}</Card> : null}
                {isResearchLoading ? (
                  <div className="flex justify-center py-10"><Loader2 className="animate-spin text-brand-purple" size={26} /></div>
                ) : researchResults.length === 0 ? (
                  <Card padding="md" className="border-white/5">
                    <h3 className="text-lg font-bold mb-2">Source cards will appear here</h3>
                    <p className="text-sm text-gray-400">Search the web for the current topic to populate source cards, then open the source map for a drill-down view.</p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {researchResults.map((result, index) => (
                      <a key={`${result.source_url}-${index}`} href={result.source_url} target="_blank" rel="noreferrer" className="block">
                        <Card padding="sm" className="border-white/5 hover:border-brand-purple/30 cursor-pointer group">
                          <div className="flex justify-between items-start mb-2 gap-4">
                            <div>
                              <h4 className="font-bold text-brand-purple group-hover:underline">{result.title}</h4>
                              <p className="text-xs text-gray-400 mt-2 line-clamp-3">{result.snippet}</p>
                            </div>
                            <ExternalLink size={14} className="text-gray-500 shrink-0" />
                          </div>
                          <span className="text-[10px] text-gray-600 font-mono">{result.source_url}</span>
                        </Card>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'sources' && (
              <div className="space-y-4">
                <Card padding="md" className="border-brand-purple/20 bg-gradient-to-br from-brand-purple/5 to-transparent">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-purple/20 flex items-center justify-center text-brand-purple"><FileText size={20} /></div>
                    <div>
                      <h3 className="font-bold">Primary Document</h3>
                      <p className="text-xs text-gray-500">{document.filename}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Analysis Status</span>
                      <span className="text-green-500 font-bold flex items-center gap-1"><CheckCircle2 size={12} />{document.status}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full w-full bg-green-500" /></div>
                  </div>
                </Card>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1 mt-8">Source Cards</h3>
                {combinedSources.length === 0 ? (
                  <Card padding="sm" className="border-white/5 text-sm text-gray-400">Ask a question or run a research search to populate sources here.</Card>
                ) : combinedSources.map((citation, index) => (
                  <a key={`${citation.url || citation.title || 'source'}-${index}`} href={citation.url} target="_blank" rel="noreferrer" className="block">
                    <Card padding="sm" className="border-white/5 flex items-center justify-between group hover:border-brand-purple/30">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-brand-purple transition-colors">{citation.url ? <ExternalLink size={16} /> : <FileText size={16} />}</div>
                        <div>
                          <div className="text-sm font-bold">{citation.title || (citation.page ? `Page ${citation.page}` : 'Document source')}</div>
                          <div className="text-[10px] text-gray-500 line-clamp-1">{citation.text || citation.url || 'PDF context'}</div>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-gray-600 group-hover:text-brand-purple group-hover:translate-x-1 transition-all" />
                    </Card>
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/5 bg-bg-dark/50 backdrop-blur-xl">
            {chatError && <div className="mb-3 text-sm text-red-200">{chatError}</div>}
            <div className="relative">
              <textarea placeholder="Ask a question about the document..." rows={1} value={chatInput} onChange={(event) => setChatInput(event.target.value)} onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  void handleSendMessage();
                }
              }} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-4 pr-14 text-sm focus:outline-none focus:border-brand-purple/50 transition-colors resize-none overflow-hidden" />
              <button onClick={() => void handleSendMessage()} disabled={isSending} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-brand-purple text-white flex items-center justify-center purple-glow hover:scale-105 transition-all disabled:opacity-60">
                {isSending ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={20} />}
              </button>
            </div>
          </div>
        </div>

        <div className="w-1/2 flex flex-col bg-bg-dark">
          <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-purple animate-pulse" />
              <h2 className="text-sm font-bold uppercase tracking-widest">Research Notes</h2>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-400 hover:text-white" onClick={() => {
                setNoteTitle('Research Notes');
                setNoteContent(EMPTY_NOTE_CONTENT);
              }}><Plus size={18} /></button>
              <button className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-400 hover:text-white" onClick={() => void persistNote()}><Save size={18} /></button>
            </div>
          </div>

          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
            <div className="max-w-2xl mx-auto space-y-6">
              <input type="text" value={noteTitle} onChange={(event) => setNoteTitle(event.target.value)} className="w-full bg-transparent text-3xl font-bold focus:outline-none border-b border-transparent focus:border-brand-purple/30 pb-2 transition-colors" />
              <div className="prose prose-invert max-w-none">
                <textarea value={noteContent} onChange={(event) => setNoteContent(event.target.value)} className="w-full h-[calc(100vh-300px)] bg-transparent focus:outline-none text-gray-300 leading-relaxed font-sans resize-none" spellCheck={false} />
              </div>
              {saveError && <p className="text-sm text-red-200">{saveError}</p>}
              {note && !saveError ? <p className="text-xs text-gray-500">Last saved {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}</p> : null}
            </div>
          </div>

          <div className="p-3 border-t border-white/5 flex items-center justify-center gap-4 bg-white/5">
            <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all">B</button>
            <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all italic">I</button>
            <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all underline">U</button>
            <div className="w-px h-4 bg-white/10" />
            <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all">List</button>
            <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all">Link</button>
          </div>
        </div>
      </main>
    </div>
  );
}
