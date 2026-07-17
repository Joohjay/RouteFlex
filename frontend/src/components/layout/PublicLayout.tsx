import { Outlet } from 'react-router-dom';
import { PublicNavbar } from './PublicNavbar';
import { PublicFooter } from './PublicFooter';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-[#C29A4A] focus:px-4 focus:py-2 focus:text-[#163A5F] focus:text-sm focus:font-medium focus:shadow-lg">
        Skip to main content
      </a>
      <PublicNavbar />
      <main id="main-content" className="flex-1 pt-20" role="main">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <PublicFooter />
    </div>
  );
}
