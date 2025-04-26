import { create } from 'zustand';
import api from '../api/axios';
import { Project, CreateProjectDto, UpdateProjectDto, Task } from '../types';
import { useAuthStore } from './authStore';

interface ProjectStore {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: CreateProjectDto) => Promise<void>;
  updateProject: (id: number, project: UpdateProjectDto) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  updateProjectTasks: (projectId: number, tasks: Task[]) => void;
  shareProject: (projectId: number) => Promise<string>;
  joinProject: (code: string) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>((set, _) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/users/${user.id}/projects`);
      set({ projects: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch projects', isLoading: false });
      throw error;
    }
  },

  addProject: async (project: CreateProjectDto) => {
    const user = useAuthStore.getState().user;
    if (!user) throw new Error('User not authenticated');

    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/projects', {
        ...project,
        ownerId: user.id
      });
      set((state) => ({
        projects: [...state.projects, response.data],
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to add project', isLoading: false });
      throw error;
    }
  },

  updateProject: async (id: number, project: UpdateProjectDto) => {
    const user = useAuthStore.getState().user;
    if (!user) throw new Error('User not authenticated');

    set({ isLoading: true, error: null });
    try {
      const response = await api.patch(`/projects/${id}`, project);
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? response.data : p)),
        currentProject: state.currentProject?.id === id ? response.data : state.currentProject,
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to update project', isLoading: false });
      throw error;
    }
  },

  deleteProject: async (id: number) => {
    const user = useAuthStore.getState().user;
    if (!user) throw new Error('User not authenticated');

    set({ isLoading: true, error: null });
    try {
      await api.delete(`/projects/${id}`);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        currentProject: state.currentProject?.id === id ? null : state.currentProject,
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to delete project', isLoading: false });
      throw error;
    }
  },

  setCurrentProject: (project) => {
    set({ currentProject: project });
  },

  updateProjectTasks: (projectId: number, tasks: Task[]) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId ? { ...p, tasks } : p
      ),
      currentProject:
        state.currentProject?.id === projectId
          ? { ...state.currentProject, tasks }
          : state.currentProject,
    }));
  },

  shareProject: async (projectId: number) => {
    try {
      const response = await api.post(`/projects/${projectId}/share`);
      return response.data.shareCode;
    } catch (error) {
      console.error('Failed to share project:', error);
      throw error;
    }
  },

  joinProject: async (code: string) => {
    const user = useAuthStore.getState().user;
    if (!user) throw new Error('User not authenticated');

    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/projects/join', { code });
      set((state) => ({
        projects: [...state.projects, response.data],
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to join project', isLoading: false });
      throw error;
    }
  },
})); 