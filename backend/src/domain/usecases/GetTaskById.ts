import { ITaskRepository } from '../interfaces/ITaskRepository';
import { Task } from '../entities/Task';
import { AppError } from '../../interfaces/middleware/errorHandler';

export class GetTaskByIdUseCase {
  constructor(private taskRepository: ITaskRepository) { }

  async execute(id: string): Promise<Task> {
    if (!id || id.trim().length === 0) {
      throw new AppError(400, 'Task ID is required');
    }

    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new AppError(404, 'Task not found');
    }

    return task;
  }
}