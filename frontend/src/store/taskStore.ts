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

export const useTaskStore = create<TaskStore>((set, _) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async (projectId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/projects/${projectId}/tasks`);
      const tasks = response.data;
      set({ tasks, isLoading: false });
      const currentProject = useProjectStore.getState().currentProject;
      if (currentProject?.id === projectId) {
        useProjectStore.getState().updateProjectTasks(projectId, tasks);
      }
      return tasks;
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      set({ error: 'Failed to fetch tasks', isLoading: false });
      throw error;
    }
  },

  addTask: async (projectId: number, task: CreateTaskDto) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(`/projects/${projectId}/tasks`, task);
      const newTask = response.data;
      set((state) => {
        const updatedTasks = [...state.tasks, newTask];
        const currentProject = useProjectStore.getState().currentProject;
        if (currentProject?.id === projectId) {
          useProjectStore.getState().updateProjectTasks(projectId, updatedTasks);
        }
        return { tasks: updatedTasks, isLoading: false };
      });
    } catch (error) {
      console.error('Failed to add task:', error);
      set({ error: 'Failed to add task', isLoading: false });
      throw error;
    }
  },

  updateTask: async (projectId: number, taskId: number, task: UpdateTaskDto) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch(`/projects/${projectId}/tasks/${taskId}`, task);
      set((state) => {
        const updatedTasks = state.tasks.map((t) => (t.id === taskId ? response.data : t));
        const currentProject = useProjectStore.getState().currentProject;
        if (currentProject?.id === projectId) {
          useProjectStore.getState().updateProjectTasks(projectId, updatedTasks);
        }
        return { tasks: updatedTasks, isLoading: false };
      });
    } catch (error) {
      console.error('Failed to update task:', error);
      set({ error: 'Failed to update task', isLoading: false });
      throw error;
    }
  },

  deleteTask: async (projectId: number, taskId: number) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/projects/${projectId}/tasks/${taskId}`);
      set((state) => {
        const updatedTasks = state.tasks.filter((t) => t.id !== taskId);
        const currentProject = useProjectStore.getState().currentProject;
        if (currentProject?.id === projectId) {
          useProjectStore.getState().updateProjectTasks(projectId, updatedTasks);
        }
        return { tasks: updatedTasks, isLoading: false };
      });
    } catch (error) {
      console.error('Failed to delete task:', error);
      set({ error: 'Failed to delete task', isLoading: false });
      throw error;
    }
  },

  toggleTaskCompletion: async (projectId: number, taskId: number) => {
    console.log('Store: Toggling task completion', { projectId, taskId });
    try {
      const response = await api.patch(`/projects/${projectId}/tasks/${taskId}/toggle`);
      console.log('Store: Server response:', response.data);
      const updatedTask = response.data;
      
      set(state => {
        const newTasks = state.tasks.map(task => 
          task.id === taskId ? updatedTask : task
        );
        console.log('Store: New tasks state:', newTasks);
        return { tasks: newTasks };
      });
      
      const currentProject = useProjectStore.getState().currentProject;
      if (currentProject?.id === projectId) {
        const updatedTasks = useTaskStore.getState().tasks;
        console.log('Store: Updating project tasks:', updatedTasks);
        useProjectStore.getState().updateProjectTasks(projectId, updatedTasks);
      }
      
      return updatedTask;
    } catch (error) {
      console.error('Store: Failed to toggle task completion:', error);
      throw error;
    }
  },

})); 