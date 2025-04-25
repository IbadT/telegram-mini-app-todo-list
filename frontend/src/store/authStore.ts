import { create } from 'zustand';
import axios from '../api/axios';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  },
})); 