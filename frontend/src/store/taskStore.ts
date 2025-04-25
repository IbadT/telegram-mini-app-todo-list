import { create } from 'zustand';
import axios from '../api/axios';
import { Task, CreateTaskDto, UpdateTaskDto } from '../types';
import { useProjectStore } from './projectStore';

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: (projectId: number) => Promise<void>;
  addTask: (projectId: number, task: CreateTaskDto) => Promise<void>;
  updateTask: (projectId: number, id: number, task: UpdateTaskDto) => Promise<void>;
  deleteTask: (projectId: number, id: number) => Promise<void>;
  toggleTaskCompletion: (projectId: number, id: number) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async (projectId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`/projects/${projectId}/tasks`);
      set({ tasks: response.data, isLoading: false });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      set({ error: 'Failed to fetch tasks', isLoading: false });
      throw error;
    }
  },

  addTask: async (projectId: number, task: CreateTaskDto) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`/projects/${projectId}/tasks`, task);
      const newTasks = [...get().tasks, response.data];
      set({ tasks: newTasks, isLoading: false });

      // Update project state
      const projectStore = useProjectStore.getState();
      const currentProject = projectStore.currentProject;
      if (currentProject && currentProject.id === projectId) {
        projectStore.setCurrentProject({
          ...currentProject,
          tasks: newTasks
        });
      }
    } catch (error) {
      console.error('Error adding task:', error);
      set({ error: 'Failed to add task', isLoading: false });
      throw error;
    }
  },

  updateTask: async (projectId: number, id: number, task: UpdateTaskDto) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.patch(`/projects/${projectId}/tasks/${id}`, task);
      const updatedTasks = get().tasks.map((t) => (t.id === id ? response.data : t));
      set({ tasks: updatedTasks, isLoading: false });

      // Update project state
      const projectStore = useProjectStore.getState();
      const currentProject = projectStore.currentProject;
      if (currentProject && currentProject.id === projectId) {
        projectStore.setCurrentProject({
          ...currentProject,
          tasks: updatedTasks
        });
      }
    } catch (error) {
      console.error('Error updating task:', error);
      set({ error: 'Failed to update task', isLoading: false });
      throw error;
    }
  },

  deleteTask: async (projectId: number, id: number) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`/projects/${projectId}/tasks/${id}`);
      const updatedTasks = get().tasks.filter((t) => t.id !== id);
      set({ tasks: updatedTasks, isLoading: false });

      // Update project state
      const projectStore = useProjectStore.getState();
      const currentProject = projectStore.currentProject;
      if (currentProject && currentProject.id === projectId) {
        projectStore.setCurrentProject({
          ...currentProject,
          tasks: updatedTasks
        });
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      set({ error: 'Failed to delete task', isLoading: false });
      throw error;
    }
  },

  toggleTaskCompletion: async (projectId: number, id: number) => {
    const task = get().tasks.find((t) => t.id === id);
    if (task) {
      await get().updateTask(projectId, id, { completed: !task.completed });
    }
  },
})); 