import { ITaskRepository } from '../interfaces/ITaskRepository';
import { Task } from '../entities/Task';

export class GetTaskByIdUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(id: string): Promise<Task> {
    if (!id || id.trim().length === 0) {
      throw new Error('Task ID is required');
    }

    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new Error('Task not found');
    }

    return task;
  }
}