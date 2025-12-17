import { create } from 'zustand';
import { AuthAPI } from '../services/api';

interface User {
  id: string; // Detail depends on API response, keeping generic for now or I can refine if I see the User type
  email: string;
  name?: string;
  role?: string;
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  checkAuth: async () => {
    set({ isLoading: true });
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const response = await AuthAPI.me();
        set({ user: response.data, isAuthenticated: true });
      } catch (error) {
        console.error("Auth check failed", error);
        localStorage.removeItem('access_token');
        set({ user: null, isAuthenticated: false });
      }
    } else {
      set({ user: null, isAuthenticated: false });
    }
    set({ isLoading: false });
  },
  logout: () => {
    localStorage.removeItem('access_token');
    set({ user: null, isAuthenticated: false });
  }
}));
