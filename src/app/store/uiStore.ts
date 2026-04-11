import { create } from 'zustand';

export type ViewType = 'chat' | 'upload' | 'browser' | 'notes' | 'themes' | 'recents';

interface UIState {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeView: 'chat',
  setActiveView: (view) => set({ activeView: view }),
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
}));
