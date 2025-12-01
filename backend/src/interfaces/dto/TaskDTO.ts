import { TaskStatus, TaskPriority } from '../../types';

export interface CreateTaskRequestDTO {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string; 
}

export interface UpdateTaskRequestDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string; 
}

export interface TaskResponseDTO {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  isOverdue?: boolean;
}

export interface ParseVoiceResponseDTO {
  transcript: string;
  parsedTask: {
    title?: string;
    description?: string;
    priority?: TaskPriority;
    dueDate?: string;
    status?: TaskStatus;
  };
}

export interface TaskFiltersDTO {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
}