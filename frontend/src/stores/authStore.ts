import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  role: 'ADMIN' | 'MANAGER' | 'DISPATCHER' | 'DRIVER' | 'VIEWER';
  status: string;
  company: {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string;
    currency: string;
  };
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isLoading: boolean;
  setAuth: (token: string, refreshToken: string, user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,
      isLoading: true,

      setAuth: (token, refreshToken, user) => {
        set({ token, refreshToken, user, isLoading: false });
      },

      logout: () => {
        const refreshToken = get().refreshToken;
        if (refreshToken) {
          api.post('/auth/logout', { refreshToken }).catch(() => undefined);
        }
        set({ token: null, refreshToken: null, user: null, isLoading: false });
      },

      checkAuth: async () => {
        const token = get().token;
        if (!token) {
          set({ isLoading: false });
          return;
        }

        try {
          const response = await api.get('/auth/me');
          set({ user: response.data.data, isLoading: false });
        } catch {
          set({ token: null, refreshToken: null, user: null, isLoading: false });
        }
      },
    }),
    {
      name: 'jj-transport-auth',
      partialize: (state) => ({ token: state.token, refreshToken: state.refreshToken, user: state.user }),
    }
  )
);
