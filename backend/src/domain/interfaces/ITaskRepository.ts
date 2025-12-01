import { Task } from '../entities/Task';
import { CreateTaskDTO, UpdateTaskDTO, TaskFilters } from '../../types';

export interface ITaskRepository {
  create(taskData: CreateTaskDTO): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findAll(filters?: TaskFilters): Promise<Task[]>;
  update(id: string, taskData: UpdateTaskDTO): Promise<Task | null>;
  delete(id: string): Promise<boolean>;
}