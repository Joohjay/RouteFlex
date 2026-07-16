import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Truck,
  Package,
  Image,
  Newspaper,
  MessageSquare,
  Users,
  Settings,
  Tag,
  Bell,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

const adminLinks = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Requests', href: '/admin/requests', icon: FileText },
  { label: 'Quotes', href: '/admin/quotes', icon: Tag },
  { label: 'Fleet', href: '/admin/fleet', icon: Truck },
  { label: 'Services', href: '/admin/services', icon: Package },
  { label: 'Gallery', href: '/admin/gallery', icon: Image },
  { label: 'Blog', href: '/admin/blog', icon: Newspaper },
  { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Notifications', href: '/admin/notifications', icon: Bell },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <div className="flex h-16 items-center justify-between border-b bg-background px-4 lg:hidden">
        <span className="font-bold">JJ Transport Admin</span>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-background transition-transform lg:translate-x-0 lg:static',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-6">
            <Link to="/admin" className="text-lg font-bold">
              JJ Transport Admin
            </Link>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {adminLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t p-4">
            <div className="mb-4 px-3">
              <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-muted-foreground">{user?.role}</p>
            </div>
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}
