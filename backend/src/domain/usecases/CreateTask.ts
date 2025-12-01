import { ITaskRepository } from '../interfaces/ITaskRepository';
import { Task } from '../entities/Task';
import { CreateTaskDTO } from '../../types';

export class CreateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(taskData: CreateTaskDTO): Promise<Task> {
    // Create task entity

    const { title, description, status, priority, dueDate } = taskData;
    const task = new Task({ title, description, status, priority, dueDate });

    // Validate task
    const errors = task.validate();
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    // Save to repository
    return await this.taskRepository.create(taskData);
  }
}