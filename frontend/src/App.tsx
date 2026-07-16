import { useEffect } from 'react';
import { useThemeStore } from './stores/themeStore';
import { useAuthStore } from './stores/authStore';
import { AppRoutes } from './routes';
import { MotionProvider, CursorGlow, LoadingScreen } from './animations';

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
      <LoadingScreen minDuration={2000} />
      <CursorGlow />
      <MotionProvider>
        <AppRoutes />
      </MotionProvider>
    </div>
  );
}

export default App;
