import { create } from 'zustand';
import axios from '../api/axios';
import { Project, CreateProjectDto, UpdateProjectDto, Task } from '../types';
import { AxiosError } from 'axios';

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
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  setCurrentProject: (project) => {
    set({ currentProject: project });
  },

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('/projects');
      console.log('Fetched projects:', response.data);
      set({ projects: response.data, isLoading: false });
    } catch (error) {
      console.error('Error fetching projects:', error);
      set({ error: 'Failed to fetch projects', isLoading: false });
      throw error;
    }
  },

  addProject: async (project: CreateProjectDto) => {
    set({ isLoading: true, error: null });
    try {
      console.log('Adding project:', project);
      const response = await axios.post('/projects', project);
      console.log('Project added:', response.data);
      set((state) => ({
        projects: [...state.projects, response.data],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error adding project:', error);
      if (error instanceof AxiosError) {
        console.error('Error details:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
          config: error.config,
        });
      }
      set({ error: 'Failed to add project', isLoading: false });
      throw error;
    }
  },

  updateProject: async (id: number, project: UpdateProjectDto) => {
    set({ isLoading: true, error: null });
    try {
      console.log('Updating project:', id, project);
      const response = await axios.patch(`/projects/${id}`, project);
      console.log('Project updated:', response.data);
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? response.data : p)),
        currentProject: state.currentProject?.id === id ? response.data : state.currentProject,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error updating project:', error);
      set({ error: 'Failed to update project', isLoading: false });
      throw error;
    }
  },

  deleteProject: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      console.log('Deleting project:', id);
      await axios.delete(`/projects/${id}`);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        currentProject: state.currentProject?.id === id ? null : state.currentProject,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error deleting project:', error);
      set({ error: 'Failed to delete project', isLoading: false });
      throw error;
    }
  },

  updateProjectTasks: (projectId: number, tasks: Task[]) => {
    set((state) => {
      const updatedProjects = state.projects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: tasks
          };
        }
        return project;
      });

      const updatedCurrentProject = state.currentProject?.id === projectId
        ? {
            ...state.currentProject,
            tasks: tasks
          }
        : state.currentProject;

      return {
        projects: updatedProjects,
        currentProject: updatedCurrentProject
      };
    });
  },
})); 