export interface Theme {
  id: string;
  name: string;
  color: string;
  accent: string;
}

export interface ThemeState {
  activeTheme: string;
  isGlassmorphismEnabled: boolean;
  isAnimationsEnabled: boolean;
}
