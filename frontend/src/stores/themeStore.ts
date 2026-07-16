import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: 'light' | 'dark';
  themePreference: Theme;
  setTheme: (theme: Theme) => void;
  initTheme: () => void;
}

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') return getSystemTheme();
  return theme;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light',
  themePreference: 'system',

  setTheme: (theme) => {
    const resolved = resolveTheme(theme);
    localStorage.setItem('jj-transport-theme', theme);
    set({ theme: resolved, themePreference: theme });

    if (resolved === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  initTheme: () => {
    const saved = (localStorage.getItem('jj-transport-theme') as Theme) ?? 'system';
    get().setTheme(saved);
  },
}));
