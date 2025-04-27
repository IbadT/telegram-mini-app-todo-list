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
  joinProject: (shareCode: string) => Promise<{ message: string; projectId: number }>;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    const user = useAuthStore.getState().user;
    if (!user?.id) return;

    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/projects`);
      const projects = response.data;
      
      // Загружаем задачи для каждого проекта
      const projectsWithTasks = await Promise.all(
        projects.map(async (project: Project) => {
          try {
            // Проверяем, есть ли у пользователя доступ к проекту
            const hasAccess = project.ownerId === user.id || 
                            project.shares?.some(share => share.userId === user.id);
            
            if (!hasAccess) {
              return { 
                ...project, 
                tasks: [],
                ownerId: project.ownerId,
                shares: project.shares || []
              };
            }

            const tasksResponse = await api.get(`/projects/${project.id}/tasks`);
            return { 
              ...project, 
              tasks: tasksResponse.data,
              ownerId: project.ownerId,
              shares: project.shares || []
            };
          } catch (error) {
            console.error(`Failed to fetch tasks for project ${project.id}:`, error);
            return { 
              ...project, 
              tasks: [],
              ownerId: project.ownerId,
              shares: project.shares || []
            };
          }
        })
      );
      
      // Обновляем текущий проект, если он существует в обновленном списке
      const currentProject = get().currentProject;
      if (currentProject) {
        const updatedCurrentProject = projectsWithTasks.find(p => p.id === currentProject.id);
        if (updatedCurrentProject) {
          set({ projects: projectsWithTasks, currentProject: updatedCurrentProject, isLoading: false });
          return;
        }
      }
      
      set({ projects: projectsWithTasks, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch projects:', error);
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
      console.error('Failed to add project:', error);
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
      console.error('Failed to update project:', error);
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
      console.error('Failed to delete project:', error);
      set({ error: 'Failed to delete project', isLoading: false });
      throw error;
    }
  },

  setCurrentProject: (project) => {
    set({ currentProject: project });
  },

  updateProjectTasks: (projectId: number, tasks: Task[]) => {
    set((state) => {
      const updatedProjects = state.projects.map((p) =>
        p.id === projectId ? { ...p, tasks } : p
      );
      
      const updatedCurrentProject = state.currentProject?.id === projectId
        ? { ...state.currentProject, tasks }
        : state.currentProject;

      return {
        projects: updatedProjects,
        currentProject: updatedCurrentProject,
      };
    });
  },

  shareProject: async (projectId: number) => {
    try {
      const response = await api.post<{ shareCode: string }>(`/projects/${projectId}/share`);
      return response.data.shareCode;
    } catch (error) {
      console.error('Failed to share project:', error);
      throw error;
    }
  },

  joinProject: async (shareCode: string) => {
    try {
      const response = await api.post<{ 
        message: string; 
        projectId: number;
        project: Project;
      }>(`/projects/join/${shareCode}`);
      
      // После успешного присоединения к проекту, обновляем список проектов
      await get().fetchProjects();
      
      // Устанавливаем присоединенный проект как текущий
      if (response.data.project) {
        set({ currentProject: response.data.project });
      } else {
        const newProject = get().projects.find(p => p.id === response.data.projectId);
        if (newProject) {
          set({ currentProject: newProject });
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('Failed to join project:', error);
      throw error;
    }
  },
})); 