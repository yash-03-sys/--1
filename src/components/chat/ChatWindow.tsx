import { motion } from 'motion/react';
import { WelcomeHero } from './WelcomeHero';
import { ChatInput } from './ChatInput';
import { useUIStore } from '@/src/app/store/uiStore';
import { Bot, User, Globe, FileText, Sparkles } from 'lucide-react';
import { cn } from '@/src/utils/cn';

export const ChatWindow = () => {
  const { activeView } = useUIStore();
  
  // Mock messages
  const messages: any[] = [];

  const isBrowserMode = activeView === 'browser';

  return (
    <div className="flex flex-col h-full relative">
      {/* Header Info */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-card/50 backdrop-blur-md border border-border-soft text-[10px] font-bold uppercase tracking-widest text-brand-primary">
          {activeView === 'browser' ? <Globe size={12} /> : activeView === 'upload' ? <FileText size={12} /> : <Sparkles size={12} />}
          <span>{activeView === 'browser' ? 'Web Browser Mode' : activeView === 'upload' ? 'Document Context' : 'General Intelligence'}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-24 space-y-12">
        {messages.length === 0 && <WelcomeHero />}
        
        <div className="max-w-3xl mx-auto space-y-8">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4",
                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-soft",
                msg.role === 'assistant' ? "bg-brand-primary text-white stitch-border" : "bg-surface-card text-brand-primary border border-border-soft"
              )}>
                {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className={cn(
                "premium-card p-6 max-w-[80%] leading-relaxed text-text-secondary",
                msg.role === 'user' ? "bg-brand-primary/5 border-brand-primary/20" : ""
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="pb-12 pt-4 bg-gradient-to-t from-surface-main via-surface-main to-transparent">
        <ChatInput />
      </div>
    </div>
  );
};
