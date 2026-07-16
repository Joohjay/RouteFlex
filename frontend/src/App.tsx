import { useEffect } from 'react';
import { useThemeStore } from './stores/themeStore';
import { useAuthStore } from './stores/authStore';
import { AppRoutes } from './routes';
import { MotionProvider } from './animations';

function App() {
  const { theme, initTheme } = useThemeStore();
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <MotionProvider>
        <AppRoutes />
      </MotionProvider>
    </div>
  );
}

export default App;
