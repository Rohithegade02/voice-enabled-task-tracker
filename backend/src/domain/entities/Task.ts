import { ITask, TaskStatus, TaskPriority } from '../../types';

export class Task {
  public id?: string;
  public title: string;
  public description?: string;
  public status: TaskStatus;
  public priority: TaskPriority;
  public dueDate?: Date;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(data: ITask) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.status = data.status || TaskStatus.TODO;
    this.priority = data.priority || TaskPriority.MEDIUM;
    this.dueDate = data.dueDate;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Business logic: Validate task data
  public validate(): string[] {
    const errors: string[] = [];

    if (!this.title || this.title.trim().length === 0) {
      errors.push('Title is required');
    }

    if (this.title && this.title.length > 200) {
      errors.push('Title must be less than 200 characters');
    }

    if (this.description && this.description.length > 1000) {
      errors.push('Description must be less than 1000 characters');
    }

    if (this.dueDate && isNaN(this.dueDate.getTime())) {
      errors.push('Invalid due date');
    }

    return errors;
  }

  // Business logic: Check if task is overdue
  public isOverdue(): boolean {
    if (!this.dueDate) return false;
    return new Date() > this.dueDate && this.status !== TaskStatus.DONE;
  }

  // Business logic: Check if task is completed
  public isCompleted(): boolean {
    return this.status === TaskStatus.DONE;
  }

  // Business logic: Mark as in progress
  public markInProgress(): void {
    this.status = TaskStatus.IN_PROGRESS;
    this.updatedAt = new Date();
  }

  // Business logic: Mark as done
  public markDone(): void {
    this.status = TaskStatus.DONE;
    this.updatedAt = new Date();
  }
}