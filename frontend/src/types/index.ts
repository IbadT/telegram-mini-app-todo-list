export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Category {
  id: number;
  name: string;
  color: string;
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
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  tasks: Task[];
} 