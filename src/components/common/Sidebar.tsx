import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  MessageSquare, 
  Upload, 
  Globe, 
  FileText, 
  Palette, 
  History, 
  ChevronLeft, 
  ChevronRight,
  File,
  Clock
} from 'lucide-react';
import { useUIStore, ViewType } from '@/src/app/store/uiStore';
import { cn } from '@/src/utils/cn';

const navItems: { id: ViewType; label: string; icon: any }[] = [
  { id: 'chat', label: 'New Chat', icon: MessageSquare },
  { id: 'upload', label: 'Upload', icon: Upload },
  { id: 'browser', label: 'Web Browser', icon: Globe },
  { id: 'notes', label: 'Research Notes', icon: FileText },
  { id: 'themes', label: 'Themes', icon: Palette },
  { id: 'recents', label: 'Recents', icon: History },
];

export const Sidebar = () => {
  const { activeView, setActiveView, isSidebarOpen, toggleSidebar } = useUIStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isSidebarOpen ? 280 : 80 }}
      className="fixed left-0 top-0 h-screen bg-surface-sidebar text-white/70 flex flex-col z-50 border-r border-white/5"
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <AnimatePresence mode="wait">
          {isSidebarOpen ? (
            <motion.div
              key="logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center"
            >
              <div className="px-3 py-1.5 rounded-lg bg-brand-primary flex items-center justify-center text-[var(--brand-text)] font-bold text-lg tracking-tighter">
                ::-1
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="logo-collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-10 h-10 rounded-lg bg-brand-primary flex items-center justify-center text-[var(--brand-text)] font-bold mx-auto text-xs tracking-tighter"
            >
              ::-1
            </motion.div>
          )}
        </AnimatePresence>
        
        {isSidebarOpen && (
          <button 
            onClick={toggleSidebar}
            className="p-1 hover:bg-white/5 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
        )}
      </div>

      {!isSidebarOpen && (
        <button 
          onClick={toggleSidebar}
          className="p-1 hover:bg-white/5 rounded-lg transition-colors mx-auto mb-4"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={cn(
              "sidebar-item",
              activeView === item.id && "sidebar-item-active",
              !isSidebarOpen && "justify-center px-0"
            )}
            title={!isSidebarOpen ? item.label : undefined}
          >
            <item.icon size={20} className={cn(activeView === item.id ? "text-white" : "text-white/50")} />
            {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
          </div>
        ))}

        {/* Divider */}
        <div className="py-4">
          <div className="h-px bg-white/5" />
        </div>

        {/* Recents Section */}
        {isSidebarOpen && (
          <div className="space-y-4">
            <div>
              <h3 className="px-4 text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">Recent Files</h3>
              <div className="space-y-1">
                <p className="px-4 text-[10px] text-white/20 italic">No recent files</p>
              </div>
            </div>
            <div>
              <h3 className="px-4 text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">Recent Chats</h3>
              <div className="space-y-1">
                <p className="px-4 text-[10px] text-white/20 italic">No recent chats</p>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/5">
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer",
          !isSidebarOpen && "justify-center"
        )}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary" />
          {isSidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Yash Khivasara</p>
              <p className="text-[10px] text-white/40 truncate">Premium Member</p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

const RecentItem = ({ icon: Icon, label }: { icon: any; label: string }) => (
  <div className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-white/5 transition-all duration-200 cursor-pointer group">
    <Icon size={14} className="text-white/30 group-hover:text-white/60" />
    <span className="text-xs text-white/50 group-hover:text-white/80 truncate">{label}</span>
  </div>
);
