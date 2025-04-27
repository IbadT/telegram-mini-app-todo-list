import { create } from 'zustand';
import api from '../api/axios';
import { Task, CreateTaskDto, UpdateTaskDto } from '../types';
import { useProjectStore } from './projectStore';

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: (projectId: number) => Promise<void>;
  addTask: (projectId: number, task: CreateTaskDto) => Promise<void>;
  updateTask: (projectId: number, taskId: number, task: UpdateTaskDto) => Promise<void>;
  deleteTask: (projectId: number, taskId: number) => Promise<void>;
  toggleTaskCompletion: (projectId: number, taskId: number) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async (projectId: number) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get<Task[]>(`/projects/${projectId}/tasks`);
      set({ tasks: response.data, isLoading: false });
      useProjectStore.getState().updateProjectTasks(projectId, response.data);
    } catch (error) {
      set({ error: 'Failed to fetch tasks', isLoading: false });
      throw error;
    }
  },

  addTask: async (projectId: number, task: CreateTaskDto) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post<Task>(`/projects/${projectId}/tasks`, task);
      const newTask = response.data;
      
      // Обновляем состояние задач
      set((state) => ({
        tasks: [...state.tasks, newTask],
        isLoading: false
      }));
      
      // Обновляем задачи в проекте
      const currentTasks = get().tasks;
      useProjectStore.getState().updateProjectTasks(projectId, [...currentTasks, newTask]);
    } catch (error) {
      set({ error: 'Failed to add task', isLoading: false });
      throw error;
    }
  },

  updateTask: async (projectId: number, taskId: number, task: UpdateTaskDto) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.put<Task>(`/projects/${projectId}/tasks/${taskId}`, task);
      const updatedTask = response.data;
      
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
        isLoading: false
      }));
      
      const currentTasks = get().tasks;
      useProjectStore.getState().updateProjectTasks(projectId, currentTasks);
    } catch (error) {
      set({ error: 'Failed to update task', isLoading: false });
      throw error;
    }
  },

  deleteTask: async (projectId: number, taskId: number) => {
    try {
      set({ isLoading: true, error: null });
      await api.delete(`/projects/${projectId}/tasks/${taskId}`);
      
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== taskId),
        isLoading: false
      }));
      
      const currentTasks = get().tasks;
      useProjectStore.getState().updateProjectTasks(projectId, currentTasks);
    } catch (error) {
      set({ error: 'Failed to delete task', isLoading: false });
      throw error;
    }
  },

  toggleTaskCompletion: async (projectId: number, taskId: number) => {
    try {
      const task = get().tasks.find((t) => t.id === taskId);
      if (!task) throw new Error('Task not found');

      // Оптимистичное обновление UI
      const updatedTask = { ...task, completed: !task.completed };
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? updatedTask : t))
      }));
      
      const currentTasks = get().tasks;
      useProjectStore.getState().updateProjectTasks(projectId, currentTasks);

      // Отправка запроса на сервер
      const response = await api.patch<Task>(`/projects/${projectId}/tasks/${taskId}`, {
        completed: !task.completed
      });

      // Обновление состояния после ответа сервера
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? response.data : t))
      }));
      
      const finalTasks = get().tasks;
      useProjectStore.getState().updateProjectTasks(projectId, finalTasks);
    } catch (error) {
      // В случае ошибки возвращаем предыдущее состояние
      const task = get().tasks.find((t) => t.id === taskId);
      if (task) {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === taskId ? task : t))
        }));
        const currentTasks = get().tasks;
        useProjectStore.getState().updateProjectTasks(projectId, currentTasks);
      }
      throw error;
    }
  }
})); 