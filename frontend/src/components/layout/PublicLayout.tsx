import { Outlet } from 'react-router-dom';
import { PublicNavbar } from './PublicNavbar';
import { PublicFooter } from './PublicFooter';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1 pt-20">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <PublicFooter />
    </div>
  );
}
