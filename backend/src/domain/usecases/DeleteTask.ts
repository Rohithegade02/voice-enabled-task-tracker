import { ITaskRepository } from '../interfaces/ITaskRepository';

export class DeleteTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(id: string): Promise<void> {
    if (!id || id.trim().length === 0) {
      throw new Error('Task ID is required');
    }

    // Check if task exists
    const existingTask = await this.taskRepository.findById(id);
    if (!existingTask) {
      throw new Error('Task not found');
    }

    const success = await this.taskRepository.delete(id);

    if (!success) {
      throw new Error('Failed to delete task');
    }
  }
}