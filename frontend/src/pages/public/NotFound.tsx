import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { SEO } from '@/components/seo/SEO';
import { SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <SEO title="Page Not Found" description="The page you are looking for does not exist or has been moved." noIndex />
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
        <SearchX size={40} className="text-gray-400" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">404</h1>
      <h2 className="mt-2 text-xl font-semibold text-gray-700 dark:text-gray-300">Page Not Found</h2>
      <p className="mt-2 max-w-md text-gray-500 dark:text-gray-400">
        The page you are looking for does not exist or has been moved. Please check the URL or navigate home.
      </p>
      <Button asChild className="mt-8">
        <Link to="/">Go Home</Link>
      </Button>
    </div>
  );
}
