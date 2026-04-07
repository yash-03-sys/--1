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
  Youtube, 
  FileText, 
  CheckCircle2, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { cn } from '@/src/utils/cn';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';

type Tab = 'chat' | 'research' | 'sources' | 'map';

const chatMessages = [
  { id: 1, role: 'assistant', text: "Hello! I've analyzed 'Quantum Computing Basics.pdf'. I found key sections on superposition, entanglement, and quantum gates. How can I help you with your research today?" },
  { id: 2, role: 'user', text: "Can you explain superposition in simple terms based on the document?" },
  { id: 3, role: 'assistant', text: "According to page 4 of the document, superposition is the ability of a quantum system to be in multiple states at the same time until it is measured. Think of it like a spinning coin that is both heads and tails simultaneously until it lands." },
];

const webResults = [
  { id: 1, title: "Quantum Superposition - Wikipedia", url: "wikipedia.org", snippet: "Quantum superposition is a fundamental principle of quantum mechanics. It states that, much like waves in classical physics, any two (or more) quantum states can be added together..." },
  { id: 2, title: "Understanding Quantum Bits (Qubits)", url: "ibm.com", snippet: "A qubit is the basic unit of quantum information. Unlike a classical bit, which can be either 0 or 1, a qubit can exist in a superposition of both states." },
];

const youtubeResults = [
  { id: 1, title: "Quantum Physics for Babies", channel: "Science Simplified", duration: "12:45", thumbnail: "https://picsum.photos/seed/quantum1/320/180" },
  { id: 2, title: "Superposition Explained", channel: "Veritasium", duration: "15:20", thumbnail: "https://picsum.photos/seed/quantum2/320/180" },
];

export default function WorkspacePage() {
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [noteContent, setNoteContent] = useState("## Superposition Notes\n\n- Superposition allows quantum systems to be in multiple states simultaneously.\n- Analogous to a spinning coin (heads and tails at once).\n- Collapses into a single state upon measurement.\n\n### Key Concepts from PDF\n- Qubits vs Classical Bits\n- Probability amplitudes\n- Measurement interference");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSaving(true);
      setTimeout(() => setIsSaving(false), 2000);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen bg-bg-dark flex flex-col overflow-hidden">
      {/* Workspace Header */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-bg-dark/50 backdrop-blur-xl z-20">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-400 hover:text-white">
            <ChevronLeft size={20} />
          </Link>
          <div className="h-6 w-px bg-white/10 mx-2" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-purple/20 flex items-center justify-center text-brand-purple">
              <FileText size={18} />
            </div>
            <div>
              <h1 className="text-sm font-bold truncate max-w-[200px]">Quantum Computing Basics.pdf</h1>
              <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest">
                <Clock size={10} /> 2 hours ago
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={cn(
            "flex items-center gap-2 text-xs font-medium transition-opacity duration-500",
            isSaving ? "opacity-100" : "opacity-0"
          )}>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-gray-400">Autosaving...</span>
          </div>
          <Button variant="primary" size="sm" glow className="flex items-center gap-2">
            <Save size={16} /> Export
          </Button>
          <button className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-400">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </header>

      {/* Main Workspace Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Side: AI & Research */}
        <div className="w-1/2 border-r border-white/5 flex flex-col bg-bg-dark/30">
          {/* Tab Navigation */}
          <div className="flex items-center gap-1 p-2 bg-white/5 border-b border-white/5">
            <button 
              onClick={() => setActiveTab('chat')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all",
                activeTab === 'chat' ? "bg-brand-purple text-white purple-glow" : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <MessageSquare size={16} /> Chat
            </button>
            <button 
              onClick={() => setActiveTab('research')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all",
                activeTab === 'research' ? "bg-brand-purple text-white purple-glow" : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Globe size={16} /> Research
            </button>
            <button 
              onClick={() => setActiveTab('sources')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all",
                activeTab === 'sources' ? "bg-brand-purple text-white purple-glow" : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Layers size={16} /> Sources
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {activeTab === 'chat' && (
              <div className="space-y-6">
                {chatMessages.map((msg) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-4",
                      msg.role === 'user' ? "flex-row-reverse" : ""
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold",
                      msg.role === 'assistant' ? "bg-brand-purple text-white purple-glow" : "bg-white/10 text-white"
                    )}>
                      {msg.role === 'assistant' ? "::" : "U"}
                    </div>
                    <Card padding="sm" className={cn(
                      "max-w-[80%] text-sm leading-relaxed",
                      msg.role === 'assistant' ? "border-brand-purple/20" : "bg-white/5 border border-white/10"
                    )}>
                      {msg.text}
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'research' && (
              <div className="space-y-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search related web information..." 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-purple/50 transition-colors"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Web Results</h3>
                  {webResults.map((result) => (
                    <Card key={result.id} padding="sm" className="border-white/5 hover:border-brand-purple/30 cursor-pointer group">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-brand-purple group-hover:underline">{result.title}</h4>
                        <ExternalLink size={14} className="text-gray-500" />
                      </div>
                      <p className="text-xs text-gray-400 mb-3 line-clamp-2">{result.snippet}</p>
                      <span className="text-[10px] text-gray-600 font-mono">{result.url}</span>
                    </Card>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Video Insights</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {youtubeResults.map((video) => (
                      <div key={video.id} className="group cursor-pointer">
                        <div className="relative aspect-video rounded-xl overflow-hidden mb-2 border border-white/5">
                          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 rounded text-[10px] font-bold text-white">
                            {video.duration}
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-10 h-10 rounded-full bg-brand-purple flex items-center justify-center text-white purple-glow">
                              <Youtube size={20} />
                            </div>
                          </div>
                        </div>
                        <h4 className="text-xs font-bold line-clamp-1 group-hover:text-brand-purple transition-colors">{video.title}</h4>
                        <p className="text-[10px] text-gray-500">{video.channel}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sources' && (
              <div className="space-y-4">
                <Card padding="md" className="border-brand-purple/20 bg-gradient-to-br from-brand-purple/5 to-transparent">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold">Primary Document</h3>
                      <p className="text-xs text-gray-500">Quantum Computing Basics.pdf</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Analysis Status</span>
                      <span className="text-green-500 font-bold flex items-center gap-1">
                        <CheckCircle2 size={12} /> Complete
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-green-500" />
                    </div>
                  </div>
                </Card>

                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1 mt-8">Cited Sources</h3>
                {[1, 2, 3].map((i) => (
                  <Card key={i} padding="sm" className="border-white/5 flex items-center justify-between group cursor-pointer hover:border-brand-purple/30">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-brand-purple transition-colors">
                        <Globe size={16} />
                      </div>
                      <div>
                        <div className="text-sm font-bold">Quantum Mechanics Intro</div>
                        <div className="text-[10px] text-gray-500">physics.edu/intro-qm</div>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-gray-600 group-hover:text-brand-purple group-hover:translate-x-1 transition-all" />
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Chat Input Area */}
          <div className="p-4 border-t border-white/5 bg-bg-dark/50 backdrop-blur-xl">
            <div className="relative">
              <textarea 
                placeholder="Ask a question about the document..." 
                rows={1}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-4 pr-14 text-sm focus:outline-none focus:border-brand-purple/50 transition-colors resize-none overflow-hidden"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-brand-purple text-white flex items-center justify-center purple-glow hover:scale-105 transition-all">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Research Notes */}
        <div className="w-1/2 flex flex-col bg-bg-dark">
          <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-purple animate-pulse" />
              <h2 className="text-sm font-bold uppercase tracking-widest">Research Notes</h2>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-400 hover:text-white">
                <Plus size={18} />
              </button>
              <button className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-400 hover:text-white">
                <Save size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
            <div className="max-w-2xl mx-auto space-y-6">
              <input 
                type="text" 
                defaultValue="Superposition & Quantum Gates" 
                className="w-full bg-transparent text-3xl font-bold focus:outline-none border-b border-transparent focus:border-brand-purple/30 pb-2 transition-colors"
              />
              
              <div className="prose prose-invert max-w-none">
                <textarea 
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full h-[calc(100vh-300px)] bg-transparent focus:outline-none text-gray-300 leading-relaxed font-sans resize-none"
                  spellCheck={false}
                />
              </div>
            </div>
          </div>
          
          {/* Notes Toolbar */}
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
