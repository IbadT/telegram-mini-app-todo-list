export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Category {
  id: number;
  name: string;
  color: string;
  projectId: number;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  priority: Priority;
  categoryId: number;
  dueDate?: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: Priority;
  completed: boolean;
  dueDate?: string;
  categoryId: number;
  category: Category;
  createdAt: string;
  updatedAt: string;
  projectId: number;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  userId: number;
  tasks?: Task[];
  shareCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  email: string;
  telegramId?: number;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  completed?: boolean;
  categoryId?: number;
} 