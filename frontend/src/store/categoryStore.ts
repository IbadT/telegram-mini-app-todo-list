import { create } from 'zustand';
import axios from '../api/axios';
import { Category, CreateCategoryDto } from '../types';

interface CategoryStore {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  addCategory: (category: CreateCategoryDto) => Promise<void>;
  updateCategory: (id: number, category: CreateCategoryDto) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('/categories');
      set({ categories: response.data, isLoading: false });
    } catch (error) {
      console.error('Error fetching categories:', error);
      set({ error: 'Failed to fetch categories', isLoading: false });
      throw error;
    }
  },

  addCategory: async (category: CreateCategoryDto) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('/categories', category);
      set((state) => ({
        categories: [...state.categories, response.data],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error adding category:', error);
      set({ error: 'Failed to add category', isLoading: false });
      throw error;
    }
  },

  updateCategory: async (id: number, category: CreateCategoryDto) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.patch(`/categories/${id}`, category);
      set((state) => ({
        categories: state.categories.map((c) => (c.id === id ? response.data : c)),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error updating category:', error);
      set({ error: 'Failed to update category', isLoading: false });
      throw error;
    }
  },

  deleteCategory: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`/categories/${id}`);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error deleting category:', error);
      set({ error: 'Failed to delete category', isLoading: false });
      throw error;
    }
  },
})); 