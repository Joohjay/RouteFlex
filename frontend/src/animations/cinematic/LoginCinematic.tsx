import { forwardRef } from 'react';
import { LoginScene } from '@/3d/scenes/LoginScene';
import type { LoginSceneHandle } from '@/3d/scenes/LoginScene';

export type { LoginSceneHandle as LoginCinematicHandle } from '@/3d/scenes/LoginScene';

interface LoginCinematicProps {
  onComplete?: () => void;
  children: React.ReactNode;
}

export const LoginCinematic = forwardRef<LoginSceneHandle, LoginCinematicProps>(
  function LoginCinematic({ onComplete, children }, ref) {
    return (
      <LoginScene ref={ref} onComplete={onComplete}>
        {children}
      </LoginScene>
    );
  }
);