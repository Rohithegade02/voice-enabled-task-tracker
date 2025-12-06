import { Request, Response, NextFunction } from 'express';
import { TaskStatus, TaskPriority } from '../../types';
import { AppError } from './errorHandler';

export const validateCreateTask = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, status, priority, dueDate } = req.body;

  // Title is required
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    throw new AppError(400, 'Title is required');
  }

  if (title.length > 200) {
    throw new AppError(400, 'Title must be less than 200 characters');
  }

  // Validate status 
  if (status && !Object.values(TaskStatus).includes(status)) {
    throw new AppError(400, `Invalid status. Must be one of: ${Object.values(TaskStatus).join(', ')}`);
  }

  // Validate priority 
  if (priority && !Object.values(TaskPriority).includes(priority)) {
    throw new AppError(400, `Invalid priority. Must be one of: ${Object.values(TaskPriority).join(', ')}`);
  }

  // Validate dueDate 
  if (dueDate) {
    const date = new Date(dueDate);
    if (isNaN(date.getTime())) {
      throw new AppError(400, 'Invalid due date format');
    }
  }

  next();
};

export const validateUpdateTask = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, status, priority, dueDate, description } = req.body;

  // At least one field must be provided  
  if (!title && !status && !priority && !dueDate && !description) {
    throw new AppError(400, 'At least one field must be provided for update');
  }

  // Validate title if provided
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      throw new AppError(400, 'Title cannot be empty');
    }
    if (title.length > 200) {
      throw new AppError(400, 'Title must be less than 200 characters');
    }
  }

  // Validate description 
  if (description !== undefined && description.length > 1000) {
    throw new AppError(400, 'Description must be less than 1000 characters');
  }

  // Validate status 
  if (status && !Object.values(TaskStatus).includes(status)) {
    throw new AppError(400, `Invalid status. Must be one of: ${Object.values(TaskStatus).join(', ')}`);
  }

  // Validate priority 
  if (priority && !Object.values(TaskPriority).includes(priority)) {
    throw new AppError(400, `Invalid priority. Must be one of: ${Object.values(TaskPriority).join(', ')}`);
  }

  // Validate dueDate 
  if (dueDate) {
    const date = new Date(dueDate);
    if (isNaN(date.getTime())) {
      throw new AppError(400, 'Invalid due date format');
    }
  }

  next();
};

export const validateTaskId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!id || id.trim().length === 0) {
    throw new AppError(400, 'Task ID is required');
  }

  // MongoDB ObjectId validation (24 hex characters)
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    throw new AppError(400, 'Invalid task ID format');
  }

  next();
};