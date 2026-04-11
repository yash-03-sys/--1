import { motion, AnimatePresence } from 'motion/react';
import { Plus, Mic, Send, File, Folder, Upload } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { cn } from '@/src/utils/cn';

export const ChatInput = () => {
  const [value, setValue] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Handle send
      setValue('');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto relative px-4">
      <div className="chat-input-container stitch-border">
        {/* Plus Button */}
        <div className="relative">
          <button 
            onClick={() => setIsUploadOpen(!isUploadOpen)}
            className={cn(
              "p-2 rounded-full hover:bg-surface-main transition-all duration-200",
              isUploadOpen ? "rotate-45 text-brand-primary" : "text-text-muted"
            )}
          >
            <Plus size={24} />
          </button>

          <AnimatePresence>
            {isUploadOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full left-0 mb-4 w-56 premium-card p-2 z-50"
              >
                <UploadOption icon={File} label="Upload file" />
                <UploadOption icon={Folder} label="Upload folder" />
                <div className="mt-2 p-4 border-2 border-dashed border-border-soft rounded-2xl flex flex-col items-center gap-2 text-text-muted hover:text-brand-primary hover:border-brand-primary transition-all cursor-pointer">
                  <Upload size={20} />
                  <span className="text-[10px] font-medium uppercase tracking-wider">Drag & Drop</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Field */}
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="how can i help you"
          rows={1}
          className="flex-1 bg-transparent border-none focus:ring-0 text-text-primary placeholder:text-text-muted/50 resize-none py-2 px-4 max-h-32 overflow-y-auto custom-scrollbar leading-relaxed"
          style={{ height: 'auto' }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${target.scrollHeight}px`;
          }}
        />

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full text-text-muted hover:text-brand-primary hover:bg-surface-main transition-all">
            <Mic size={22} />
          </button>
          <button 
            disabled={!value.trim()}
            className={cn(
              "p-2 rounded-full transition-all",
              value.trim() ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" : "text-text-muted opacity-50"
            )}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

const UploadOption = ({ icon: Icon, label }: { icon: any; label: string }) => (
  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-surface-main text-text-secondary transition-colors text-sm">
    <Icon size={18} className="text-brand-primary" />
    <span>{label}</span>
  </button>
);
