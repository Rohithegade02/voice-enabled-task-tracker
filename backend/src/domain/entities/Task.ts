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

  //Validate task data
  public validate(): string[] {
    const errors: string[] = [];

    if (this.priority && !Object.values(TaskPriority).includes(this.priority)) {
      errors.push('Invalid priority');
    }

    return errors;
  }

  //Check if task is overdue
  public isOverdue(): boolean {
    if (!this.dueDate) return false;
    return new Date() > this.dueDate && this.status !== TaskStatus.DONE;
  }

  //Check if task is completed
  public isCompleted(): boolean {
    return this.status === TaskStatus.DONE;
  }

  //Mark as in progress
  public markInProgress(): void {
    this.status = TaskStatus.IN_PROGRESS;
    this.updatedAt = new Date();
  }

  //Mark as done
  public markDone(): void {
    this.status = TaskStatus.DONE;
    this.updatedAt = new Date();
  }
}