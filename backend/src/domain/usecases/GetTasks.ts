import { ITaskRepository } from '../interfaces/ITaskRepository';
import { Task } from '../entities/Task';
import { TaskFilters } from '../../types';

export class GetTasksUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(filters?: TaskFilters): Promise<Task[]> {
    return await this.taskRepository.findAll(filters);
  }
}