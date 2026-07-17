import { useEffect } from 'react';
import { useThemeStore } from './stores/themeStore';
import { useAuthStore } from './stores/authStore';
import { AppRoutes } from './routes';
import { MotionProvider, CursorGlow, LoadingScreen } from './animations';
import Lenis from 'lenis';

function App() {
  const { theme, initTheme } = useThemeStore();
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

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
