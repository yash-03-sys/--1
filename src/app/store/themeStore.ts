import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeType = 'cream' | 'black' | 'white' | 'grey' | 'yellow-brown' | 'warm-brown';

interface ThemeState {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'cream',
      setTheme: (theme) => {
        set({ theme });
        document.documentElement.setAttribute('data-theme', theme);
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);
