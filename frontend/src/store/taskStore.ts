import { create } from 'zustand';
import api from '../api/axios';
import { Task, CreateTaskDto, UpdateTaskDto } from '../types';
import { useProjectStore } from './projectStore';

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: (projectId: number) => Promise<void>;
  addTask: (projectId: number, task: CreateTaskDto) => Promise<void>;
  updateTask: (projectId: number, taskId: number, task: UpdateTaskDto) => Promise<void>;
  deleteTask: (projectId: number, taskId: number) => Promise<void>;
  toggleTaskCompletion: (projectId: number, taskId: number) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async (projectId: number) => {
    try {
      set({ loading: true, error: null });
      const response = await api.get<Task[]>(`/projects/${projectId}/tasks`);
      set({ tasks: response.data, loading: false });
      useProjectStore.getState().updateProjectTasks(projectId, response.data);
    } catch (error) {
      set({ error: 'Failed to fetch tasks', loading: false });
      throw error;
    }
  },

  addTask: async (projectId: number, task: CreateTaskDto) => {
    try {
      set({ loading: true, error: null });
      const response = await api.post<Task>(`/projects/${projectId}/tasks`, task);
      set((state) => ({
        tasks: [...state.tasks, response.data],
        loading: false
      }));
      useProjectStore.getState().updateProjectTasks(projectId, [...get().tasks, response.data]);
    } catch (error) {
      set({ error: 'Failed to add task', loading: false });
      throw error;
    }
  },

  updateTask: async (projectId: number, taskId: number, task: UpdateTaskDto) => {
    try {
      set({ loading: true, error: null });
      const response = await api.put<Task>(`/projects/${projectId}/tasks/${taskId}`, task);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? response.data : t)),
        loading: false
      }));
      useProjectStore.getState().updateProjectTasks(projectId, get().tasks.map((t) => (t.id === taskId ? response.data : t)));
    } catch (error) {
      set({ error: 'Failed to update task', loading: false });
      throw error;
    }
  },

  deleteTask: async (projectId: number, taskId: number) => {
    try {
      set({ loading: true, error: null });
      await api.delete(`/projects/${projectId}/tasks/${taskId}`);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== taskId),
        loading: false
      }));
      useProjectStore.getState().updateProjectTasks(projectId, get().tasks.filter((t) => t.id !== taskId));
    } catch (error) {
      set({ error: 'Failed to delete task', loading: false });
      throw error;
    }
  },

  toggleTaskCompletion: async (projectId: number, taskId: number) => {
    try {
      set({ loading: true, error: null });
      const task = get().tasks.find((t) => t.id === taskId);
      if (!task) throw new Error('Task not found');

      const response = await api.put<Task>(`/projects/${projectId}/tasks/${taskId}`, {
        completed: !task.completed
      });

      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? response.data : t)),
        loading: false
      }));
      useProjectStore.getState().updateProjectTasks(projectId, get().tasks.map((t) => (t.id === taskId ? response.data : t)));
    } catch (error) {
      set({ error: 'Failed to toggle task completion', loading: false });
      throw error;
    }
  }
})); 