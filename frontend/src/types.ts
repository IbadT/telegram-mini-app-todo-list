export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface Category {
  id: number;
  name: string;
  color: string;
  projectId: number;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string;
  category: Category;
  projectId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string;
  categoryId: number;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: Priority;
  dueDate?: string;
  categoryId?: number;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  shareCode: string;
  creatorId: number;
  creator: {
    id: number;
    username: string;
  };
  tasks?: Task[];
  categories: Category[];
  ownerId: number;
  shares?: Array<{
    id: number;
    userId: number;
    projectId: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
}

export interface ShareProjectDto {
  shareCode: string;
}

export interface ProjectShare {
  id: number;
  projectId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  color: string;
  projectId: number;
} 