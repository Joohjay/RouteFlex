import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ArrowRight, ChevronRight } from 'lucide-react';
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

const menuVariants = {
  hidden: { x: '100%', opacity: 0 },
  visible: {
    x: 0, opacity: 1,
    transition: { type: 'spring', damping: 25, stiffness: 200, mass: 0.8 },
  },
  exit: {
    x: '100%', opacity: 0,
    transition: { duration: 0.2, ease: 'easeInOut' },
  },
};

const linkItemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: 0.05 * i, duration: 0.3 },
  }),
};

export function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const { data } = usePublicProfile();
  const { user } = useAuthStore();
  const company = data?.company;

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const close = useCallback(() => setIsOpen(false), []);

  return (
    <header className="fixed top-0 z-50 w-full bg-[#0a0e1a]/95 shadow-sm">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <img
            src="/images/logo/jj-transports-logo-new-design-removebg-preview.png"
            alt="JJ Transport"
            className="h-12 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'relative rounded-lg px-4 py-2 text-sm font-medium transition-colors text-white/80 hover:text-white',
                  isActive && 'text-[#f59e0b]'
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

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 lg:flex">
          {company?.phone && (
            <a
              href={`tel:${company.phone}`}
              className="flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
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
            <Button asChild variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/10">
              <Link to="/login">Login</Link>
            </Button>
          )}
          <Button asChild size="sm" className="bg-[#f59e0b] text-[#0f172a] hover:bg-[#d97706] shadow-lg shadow-[#f59e0b]/25">
            <Link to="/book">
              Book Transport
              <ArrowRight size={15} className="ml-1.5" />
            </Link>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative z-50 rounded-lg p-2 text-white transition-colors"
            aria-label="Toggle menu"
          >
            <motion.div
              animate={isOpen ? { rotate: 90 } : { rotate: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay + drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={close}
            />
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-white/10 bg-[#0a0e1a] shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between px-6 pt-6">
                <span className="text-lg font-bold text-white">Menu</span>
                <button
                  onClick={close}
                  className="rounded-lg p-2 text-white/60 hover:text-white"
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="mt-8 flex-1 space-y-1 overflow-y-auto px-4">
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      custom={i}
                      variants={linkItemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Link
                        to={link.href}
                        onClick={close}
                        className={cn(
                          'flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium transition-colors',
                          isActive
                            ? 'bg-[#f59e0b]/10 text-[#f59e0b]'
                            : 'text-gray-300 hover:bg-white/5 hover:text-white'
                        )}
                      >
                        {link.label}
                        <ChevronRight size={16} className={cn(isActive ? 'text-[#f59e0b]' : 'text-gray-600')} />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <div className="border-t border-white/10 px-6 py-6 space-y-3">
                {user ? (
                  <Button asChild className="w-full" onClick={close}>
                    <Link to="/admin">Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="outline" className="w-full border-white/20 text-white hover:bg-white/10" onClick={close}>
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full border-white/20 text-white hover:bg-white/10" onClick={close}>
                      <Link to="/register">Register</Link>
                    </Button>
                  </>
                )}
                <Button asChild className="w-full bg-[#f59e0b] text-[#0a0e1a] hover:bg-[#d97706]" onClick={close}>
                  <Link to="/book">
                    Book Transport
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                </Button>
                {company?.phone && (
                  <a
                    href={`tel:${company.phone}`}
                    className="flex items-center justify-center gap-2 pt-2 text-sm text-gray-400 hover:text-white"
                  >
                    <Phone size={14} />
                    {company.phone}
                  </a>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
