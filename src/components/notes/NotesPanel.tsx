import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Pin, Trash2, Edit3, MoreVertical, X, Copy, Globe, ChevronLeft } from 'lucide-react';
import React, { useState } from 'react';
import { cn } from '@/src/utils/cn';

interface Note {
  id: string;
  title: string;
  content: string;
  topic: string;
  isPinned: boolean;
  date: string;
}

export const NotesPanel = ({ isSidebar = false }: { isSidebar?: boolean }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState({ title: '', content: '', topic: 'General' });
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleSave = () => {
    if (!newNote.title.trim()) return;
    const note: Note = {
      id: Math.random().toString(),
      ...newNote,
      isPinned: false,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
    setNotes([note, ...notes]);
    setIsCreating(false);
    setNewNote({ title: '', content: '', topic: 'General' });
  };

  const handleDelete = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
    if (selectedNote?.id === id) setSelectedNote(null);
    setActiveMenu(null);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setActiveMenu(null);
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isCreating) {
    return (
      <div className={cn("h-full flex flex-col space-y-6", !isSidebar && "w-full max-w-4xl mx-auto p-8")}>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsCreating(false)} className="p-2 hover:bg-surface-main rounded-full transition-colors">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-2xl font-serif font-medium text-text-primary">New Research Note</h2>
        </div>
        <div className="space-y-4 flex-1 flex flex-col">
          <input 
            type="text" 
            placeholder="Note Title" 
            value={newNote.title}
            onChange={e => setNewNote({...newNote, title: e.target.value})}
            className="w-full bg-transparent border-none text-2xl font-medium focus:ring-0 placeholder:text-text-muted/30"
          />
          <input 
            type="text" 
            placeholder="Topic (e.g. Physics, Business)" 
            value={newNote.topic}
            onChange={e => setNewNote({...newNote, topic: e.target.value})}
            className="w-full bg-transparent border-none text-sm text-brand-primary font-bold uppercase tracking-widest focus:ring-0 placeholder:text-text-muted/30"
          />
          <textarea 
            placeholder="Start typing your research insights..." 
            value={newNote.content}
            onChange={e => setNewNote({...newNote, content: e.target.value})}
            className="flex-1 w-full bg-transparent border-none resize-none focus:ring-0 text-text-secondary leading-relaxed placeholder:text-text-muted/30"
          />
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={() => setIsCreating(false)} className="px-6 py-2 rounded-full text-text-muted hover:bg-surface-main transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-8 py-2 rounded-full bg-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:scale-105 transition-transform">Save Note</button>
        </div>
      </div>
    );
  }

  if (selectedNote) {
    return (
      <div className={cn("h-full flex flex-col space-y-6", !isSidebar && "w-full max-w-4xl mx-auto p-8")}>
        <div className="flex items-center justify-between">
          <button onClick={() => setSelectedNote(null)} className="p-2 hover:bg-surface-main rounded-full transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => handleCopy(selectedNote.content)} className="p-2 hover:bg-surface-main rounded-full text-text-muted transition-colors"><Copy size={18} /></button>
            <button onClick={() => handleDelete(selectedNote.id)} className="p-2 hover:bg-surface-main rounded-full text-text-muted hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
          </div>
        </div>
        <div className="space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary bg-brand-primary/5 px-2 py-1 rounded-md">
            {selectedNote.topic}
          </span>
          <h2 className="text-3xl font-serif font-medium text-text-primary">{selectedNote.title}</h2>
          <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">{selectedNote.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "h-full flex flex-col space-y-6",
      !isSidebar && "w-full max-w-4xl mx-auto p-8"
    )}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className={cn("font-serif font-medium text-text-primary", isSidebar ? "text-xl" : "text-3xl")}>Research Notes</h2>
          {!isSidebar && <p className="text-text-secondary">Capture and organize your insights.</p>}
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-lg shadow-brand-primary/20 hover:scale-110 transition-transform"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes or topics..."
          className="w-full bg-surface-main border border-border-soft rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-brand-primary/10 transition-all"
        />
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12 premium-card">
            <p className="text-text-muted">No notes found.</p>
          </div>
        ) : (
          <div className={cn("grid gap-4", !isSidebar && "grid-cols-1 md:grid-cols-2")}>
            {filteredNotes.map((note) => (
              <motion.div
                key={note.id}
                layout
                onClick={() => setSelectedNote(note)}
                className="premium-card p-5 group relative stitch-border cursor-pointer hover:border-brand-primary/30"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary bg-brand-primary/5 px-2 py-1 rounded-md">
                    {note.topic}
                  </span>
                  <div className="flex items-center gap-1 relative">
                    <button 
                      onClick={(e) => { e.stopPropagation(); /* Toggle pin */ }}
                      className={cn("p-1.5 rounded-lg transition-colors", note.isPinned ? "text-brand-primary bg-brand-primary/10" : "text-text-muted hover:bg-surface-main")}
                    >
                      <Pin size={14} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === note.id ? null : note.id); }}
                      className="p-1.5 rounded-lg text-text-muted hover:bg-surface-main transition-colors"
                    >
                      <MoreVertical size={14} />
                    </button>

                    <AnimatePresence>
                      {activeMenu === note.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          className="absolute top-full right-0 mt-2 w-40 premium-card p-1 z-50 shadow-xl"
                          onClick={e => e.stopPropagation()}
                        >
                          <MenuAction icon={Copy} label="Copy Content" onClick={() => handleCopy(note.content)} />
                          <MenuAction icon={Globe} label="Web Search" onClick={() => { /* Handle web search */ setActiveMenu(null); }} />
                          <div className="h-px bg-border-soft my-1" />
                          <MenuAction icon={Trash2} label="Delete Note" onClick={() => handleDelete(note.id)} variant="danger" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <h3 className="font-medium text-text-primary mb-2 group-hover:text-brand-primary transition-colors">{note.title}</h3>
                <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed mb-4">
                  {note.content}
                </p>

                <div className="flex items-center justify-between text-[10px] text-text-muted pt-4 border-t border-border-soft">
                  <span>{note.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const MenuAction = ({ icon: Icon, label, onClick, variant = 'default' }: { icon: any; label: string; onClick: () => void; variant?: 'default' | 'danger' }) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-colors",
      variant === 'danger' ? "text-red-500 hover:bg-red-50" : "text-text-secondary hover:bg-surface-main"
    )}
  >
    <Icon size={14} />
    <span>{label}</span>
  </button>
);
