import { ITaskRepository } from '../interfaces/ITaskRepository';
import { AppError } from '../../interfaces/middleware/errorHandler';

export class DeleteTaskUseCase {
  constructor(private taskRepository: ITaskRepository) { }

  async execute(id: string): Promise<void> {
    if (!id || id.trim().length === 0) {
      throw new AppError(400, 'Task ID is required');
    }

    // Check if task exists
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new AppError(404, 'Task not found');
    }

    const deleted = await this.taskRepository.delete(id);

    if (!deleted) {
      throw new AppError(500, 'Failed to delete task');
    }
  }
}