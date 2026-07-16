import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { usePublicProfile } from '@/hooks/usePublicData';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Fleet', href: '/fleet' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { data } = usePublicProfile();
  const { user } = useAuthStore();
  const company = data?.company;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-white/90 shadow-sm backdrop-blur-lg dark:bg-[#0a0e1a]/90'
          : 'bg-transparent'
      )}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-[#0f172a] dark:bg-[#f59e0b]">
            <span className="relative z-10 text-base font-extrabold text-white dark:text-[#0f172a]">JJ</span>
            <div className="absolute inset-0 bg-gradient-to-br from-[#f59e0b]/20 to-transparent" />
          </div>
          <span className={cn(
            'text-xl font-bold tracking-tight transition-colors',
            scrolled ? 'text-[#0f172a] dark:text-white' : 'text-white'
          )}>
            {company?.name ?? 'JJ Transport'}
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'relative rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  scrolled
                    ? 'text-gray-600 hover:text-[#0f172a] dark:text-gray-300 dark:hover:text-white'
                    : 'text-white/80 hover:text-white',
                  isActive && (scrolled ? 'text-[#0f172a] dark:text-[#f59e0b]' : 'text-[#f59e0b]')
                )}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-0.5 left-2 right-2 h-0.5 rounded-full bg-[#f59e0b]"
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {company?.phone && (
            <a
              href={`tel:${company.phone}`}
              className={cn(
                'flex items-center gap-2 text-sm font-medium transition-colors',
                scrolled ? 'text-gray-600 hover:text-[#0f172a] dark:text-gray-300' : 'text-white/80 hover:text-white'
              )}
            >
              <Phone size={15} />
              {company.phone}
            </a>
          )}
          <ThemeToggle />
          {user ? (
            <Button asChild variant="outline" size="sm" className="border-[#f59e0b] text-[#f59e0b] hover:bg-[#f59e0b] hover:text-[#0f172a]">
              <Link to="/admin">Dashboard</Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm" className={cn(scrolled ? '' : 'text-white hover:text-white hover:bg-white/10')}>
              <Link to="/login">Login</Link>
            </Button>
          )}
          <Button asChild size="sm" className="bg-[#f59e0b] text-[#0f172a] hover:bg-[#d97706]">
            <Link to="/book">
              Book Transport
              <ArrowRight size={15} className="ml-1.5" />
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              'rounded-lg p-2 transition-colors',
              scrolled ? 'text-[#0f172a] dark:text-white' : 'text-white'
            )}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-100 bg-white shadow-xl dark:border-gray-800 dark:bg-[#0a0e1a] lg:hidden"
          >
            <div className="space-y-1 px-4 py-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center rounded-lg px-4 py-3 text-base font-medium transition-colors',
                      isActive
                        ? 'bg-[#f59e0b]/10 text-[#f59e0b]'
                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5'
                    )}
                  >
                    {link.label}
                    {isActive && <span className="ml-auto h-2 w-2 rounded-full bg-[#f59e0b]" />}
                  </Link>
                );
              })}
              <hr className="my-4 border-gray-100 dark:border-gray-800" />
              {user ? (
                <Button asChild className="w-full">
                  <Link to="/admin" onClick={() => setIsOpen(false)}>Dashboard</Link>
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/register" onClick={() => setIsOpen(false)}>Register</Link>
                  </Button>
                </div>
              )}
              <Button asChild className="mt-2 w-full bg-[#f59e0b] text-[#0f172a] hover:bg-[#d97706]">
                <Link to="/book" onClick={() => setIsOpen(false)}>
                  Book Transport
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
              {company?.phone && (
                <a
                  href={`tel:${company.phone}`}
                  className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400"
                >
                  <Phone size={14} />
                  {company.phone}
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
