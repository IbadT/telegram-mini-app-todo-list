import { create } from 'zustand';
import axios from '../api/axios';

interface AuthStore {
  user: any | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: any) => void;
  setToken: (token: string) => void;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),

  checkAuth: async () => {
    try {
      set({ isLoading: true, error: null });
      // @ts-ignore
      const telegramData = window.Telegram.WebApp.initData;
      if (!telegramData) {
        throw new Error('No Telegram data available');
      }

      const response = await axios.post('/auth/telegram', {
        initData: telegramData
      });

      set({
        user: response.data.user,
        token: response.data.access_token,
        isLoading: false
      });

      // Set the token in axios defaults
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
    } catch (error) {
      set({ error: 'Authentication failed', isLoading: false });
      throw error;
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post('/auth/login', { email, password });
      set({
        user: response.data.user,
        token: response.data.access_token,
        isLoading: false
      });
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
    } catch (error) {
      set({ error: 'Login failed', isLoading: false });
      throw error;
    }
  },

  register: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post('/auth/register', { email, password });
      set({
        user: response.data.user,
        token: response.data.access_token,
        isLoading: false
      });
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
    } catch (error) {
      set({ error: 'Registration failed', isLoading: false });
      throw error;
    }
  },
})); 