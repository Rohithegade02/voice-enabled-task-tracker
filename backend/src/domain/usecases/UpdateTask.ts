import { ITaskRepository } from '../interfaces/ITaskRepository';
import { Task } from '../entities/Task';
import { UpdateTaskDTO } from '../../types';

export class UpdateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(id: string, taskData: UpdateTaskDTO): Promise<Task> {
    if (!id || id.trim().length === 0) {
      throw new Error('Task ID is required');
    }

    // Check if task exists
    const existingTask = await this.taskRepository.findById(id);
    if (!existingTask) {
      throw new Error('Task not found');
    }

    // Create updated task entity for validation
    const updatedTask = new Task({
      ...existingTask,
      ...taskData,
    });

    // Validate updated task
    const errors = updatedTask.validate();
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    // Update in repository
    const result = await this.taskRepository.update(id, taskData);

    if (!result) {
      throw new Error('Failed to update task');
    }

    return result;
  }
}