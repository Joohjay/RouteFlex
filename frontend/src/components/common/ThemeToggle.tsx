import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useThemeStore } from '@/stores/themeStore';

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  );
}
