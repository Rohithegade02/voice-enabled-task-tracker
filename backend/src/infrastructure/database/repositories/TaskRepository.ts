import { ITaskRepository } from '../../../domain/interfaces/ITaskRepository';
import { Task } from '../../../domain/entities/Task';
import { CreateTaskDTO, UpdateTaskDTO, TaskFilters } from '../../../types';
import { TaskModel, ITaskDocument } from '../models/TaskModel';

export class TaskRepository implements ITaskRepository {
  // create task
  async create(taskData: CreateTaskDTO): Promise<Task> {
    const taskDoc = await TaskModel.create(taskData);
    return this.mapToEntity(taskDoc);
  }

  // find task by id
  async findById(id: string): Promise<Task | null> {
    const taskDoc = await TaskModel.findById(id);
    return taskDoc ? this.mapToEntity(taskDoc) : null;
  }

  // find all tasks
  async findAll(filters?: TaskFilters): Promise<Task[]> {
    const query: any = {};

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.priority) {
      query.priority = filters.priority;
    }

    if (filters?.dueDateFrom || filters?.dueDateTo) {
      query.dueDate = {};
      if (filters.dueDateFrom) {
        query.dueDate.$gte = filters.dueDateFrom;
      }
      if (filters.dueDateTo) {
        query.dueDate.$lte = filters.dueDateTo;
      }
    }

    if (filters?.search) {
      // perform text search using $or operator(includes both title and description)
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const taskDocs = await TaskModel.find(query).sort({ createdAt: -1 });
    return taskDocs.map((doc) => this.mapToEntity(doc));
  }

  // update task
  async update(id: string, taskData: UpdateTaskDTO): Promise<Task | null> {
    const taskDoc = await TaskModel.findByIdAndUpdate(
      id,
      { ...taskData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    return taskDoc ? this.mapToEntity(taskDoc) : null;
  }

  // delete task
  async delete(id: string): Promise<boolean> {
    const result = await TaskModel.findByIdAndDelete(id);
    return result !== null;
  }

  // Helper method to map Mongoose document to domain entity
  private mapToEntity(doc: ITaskDocument): Task {
    return new Task({
      id: doc._id.toString(),
      title: doc.title,
      description: doc.description,
      status: doc.status,
      priority: doc.priority,
      dueDate: doc.dueDate,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}