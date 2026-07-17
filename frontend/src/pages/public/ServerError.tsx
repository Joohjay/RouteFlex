import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { SEO } from '@/components/seo/SEO';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ServerError() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <SEO title="Server Error" description="Something went wrong on our end. Please try again." noIndex />
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-900/20">
        <AlertTriangle size={40} className="text-red-500" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">500</h1>
      <h2 className="mt-2 text-xl font-semibold text-gray-700 dark:text-gray-300">Server Error</h2>
      <p className="mt-2 max-w-md text-gray-500 dark:text-gray-400">
        Something went wrong on our end. Please try refreshing the page, or come back later.
      </p>
      <div className="mt-8 flex gap-4">
        <Button onClick={() => window.location.reload()}>
          <RefreshCw size={16} className="mr-2" />
          Refresh Page
        </Button>
        <Button asChild variant="outline">
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
