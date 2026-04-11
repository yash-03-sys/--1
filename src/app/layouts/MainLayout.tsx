import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from '@/src/components/common/Sidebar';
import { useUIStore } from '@/src/app/store/uiStore';
import { useThemeStore } from '@/src/app/store/themeStore';
import { ChatWindow } from '@/src/components/chat/ChatWindow';
import { UploadPanel } from '@/src/components/upload/UploadPanel';
import { ThemePanel } from '@/src/components/settings/ThemePanel';
import { NotesPanel } from '@/src/components/notes/NotesPanel';
import { useEffect } from 'react';
import { cn } from '@/src/utils/cn';

export const MainLayout = () => {
  const { activeView, isSidebarOpen } = useUIStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const renderContent = () => {
    switch (activeView) {
      case 'chat':
      case 'browser':
        return <ChatWindow />;
      case 'upload':
        return <UploadPanel />;
      case 'themes':
        return <ThemePanel />;
      case 'notes':
        return <NotesPanel />;
      case 'recents':
        return (
          <div className="flex flex-col items-center justify-center h-full text-text-muted space-y-4">
            <div className="w-16 h-16 rounded-full bg-surface-card flex items-center justify-center border border-border-soft">
              <p className="text-2xl">📜</p>
            </div>
            <p className="font-medium">No recent history found.</p>
          </div>
        );
      default:
        return <ChatWindow />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface-main">
      <Sidebar />
      
      <main 
        className={cn(
          "flex-1 flex transition-all duration-300",
          isSidebarOpen ? "ml-[280px]" : "ml-[80px]"
        )}
      >
        <div className="flex-1 relative h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Panel for Browser Mode */}
        <AnimatePresence>
          {activeView === 'browser' && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-96 border-l border-border-soft bg-surface-card p-6 shadow-2xl z-20"
            >
              <NotesPanel isSidebar />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
