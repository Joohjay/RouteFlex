import { Navigate, Outlet } from 'react-router-dom';
import { Loading } from '@/components/common/Loading';
import { AdminSidebar } from './AdminSidebar';
import { useAuthStore } from '@/stores/authStore';

export function AdminLayout() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading size={40} text="Loading admin panel..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminSidebar />
      <main className="flex-1 overflow-auto bg-muted/30 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
