import { ITaskRepository } from '../interfaces/ITaskRepository';
import { Task } from '../entities/Task';
import { CreateTaskDTO } from '../../types';
import { AppError } from '../../interfaces/middleware/errorHandler';

export class CreateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) { }

  async execute(taskData: CreateTaskDTO): Promise<Task> {

    const { title, description, status, priority, dueDate } = taskData;
    const task = new Task({ title, description, status, priority, dueDate });

    const errors = task.validate();
    if (errors.length > 0) {
      throw new AppError(400, `Validation failed: ${errors.join(', ')}`);
    }

    return await this.taskRepository.create(taskData);
  }
}