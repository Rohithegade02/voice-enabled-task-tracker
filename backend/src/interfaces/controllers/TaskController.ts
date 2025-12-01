import { Request, Response } from 'express';
import { CreateTaskUseCase } from '../../domain/usecases/CreateTask';
import { GetTasksUseCase } from '../../domain/usecases/GetTasks';
import { GetTaskByIdUseCase } from '../../domain/usecases/GetTaskById';
import { UpdateTaskUseCase } from '../../domain/usecases/UpdateTask';
import { DeleteTaskUseCase } from '../../domain/usecases/DeleteTask';
import { ParseVoiceInputUseCase } from '../../domain/usecases/ParseVoiceInput';
import { Task } from '../../domain/entities/Task';
import {
  CreateTaskRequestDTO,
  UpdateTaskRequestDTO,
  TaskResponseDTO,
  ParseVoiceResponseDTO,
  TaskFiltersDTO,
} from '../dto/TaskDTO';
import { TaskStatus, TaskPriority, CreateTaskDTO, UpdateTaskDTO, TaskFilters } from '../../types';
import { AppError } from '../middleware/errorHandler';

export class TaskController {
  constructor(
    private createTaskUseCase: CreateTaskUseCase,
    private getTasksUseCase: GetTasksUseCase,
    private getTaskByIdUseCase: GetTaskByIdUseCase,
    private updateTaskUseCase: UpdateTaskUseCase,
    private deleteTaskUseCase: DeleteTaskUseCase,
    private parseVoiceInputUseCase: ParseVoiceInputUseCase
  ) {}

  // Create task manually
  createTask = async (req: Request, res: Response): Promise<void> => {
    const requestData: CreateTaskRequestDTO = req.body;

    const taskData: CreateTaskDTO = {
      title: requestData.title,
      description: requestData.description,
      status: requestData.status || TaskStatus.TODO,
      priority: requestData.priority || TaskPriority.MEDIUM,
      dueDate: requestData.dueDate ? new Date(requestData.dueDate) : undefined,
    };

    const task = await this.createTaskUseCase.execute(taskData);

    res.status(201).json({
      success: true,
      data: this.mapToResponseDTO(task),
    });
  };

  // Get all tasks with optional filters
  getTasks = async (req: Request, res: Response): Promise<void> => {
    const filtersDTO: TaskFiltersDTO = req.query;

    const filters: TaskFilters = {
      status: filtersDTO.status,
      priority: filtersDTO.priority,
      search: filtersDTO.search,
      dueDateFrom: filtersDTO.dueDateFrom ? new Date(filtersDTO.dueDateFrom) : undefined,
      dueDateTo: filtersDTO.dueDateTo ? new Date(filtersDTO.dueDateTo) : undefined,
    };

    const tasks = await this.getTasksUseCase.execute(filters);

    res.status(200).json({
      success: true,
      data: tasks.map((task) => this.mapToResponseDTO(task)),
      count: tasks.length,
    });
  };

  // Get single task by ID
  getTaskById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const task = await this.getTaskByIdUseCase.execute(id);

    res.status(200).json({
      success: true,
      data: this.mapToResponseDTO(task),
    });
  };

  // Update task
  updateTask = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const requestData: UpdateTaskRequestDTO = req.body;

    const updateData: UpdateTaskDTO = {
      title: requestData.title,
      description: requestData.description,
      status: requestData.status,
      priority: requestData.priority,
      dueDate: requestData.dueDate ? new Date(requestData.dueDate) : undefined,
    };

    const task = await this.updateTaskUseCase.execute(id, updateData);

    res.status(200).json({
      success: true,
      data: this.mapToResponseDTO(task),
    });
  };

  // Delete task
  deleteTask = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    await this.deleteTaskUseCase.execute(id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  };

  // Parse voice input
  parseVoiceInput = async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      throw new AppError(400, 'No audio file provided');
    }

    const audioBuffer = req.file.buffer;

    const parsedInput = await this.parseVoiceInputUseCase.execute(audioBuffer);

    const response: ParseVoiceResponseDTO = {
      transcript: parsedInput.transcript,
      parsedTask: {
        title: parsedInput.title,
        description: parsedInput.description,
        priority: parsedInput.priority,
        dueDate: parsedInput.dueDate?.toISOString(),
        status: parsedInput.status,
      },
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  };

  // for testing purposes
  // Add this method to TaskController class
parseTextInput = async (req: Request, res: Response): Promise<void> => {
  const { transcript } = req.body;

  if (!transcript || typeof transcript !== 'string' || transcript.trim().length === 0) {
    throw new AppError(400, 'Transcript is required');
  }

  // Create a mock service that only does Gemini parsing
  const gemini = new (await import('../../infrastructure/services/GeminiParserService')).GeminiParserService();
  const parsedInput = await gemini.parseTaskFromTranscript(transcript);

  const response: ParseVoiceResponseDTO = {
    transcript: parsedInput.transcript,
    parsedTask: {
      title: parsedInput.title,
      description: parsedInput.description,
      priority: parsedInput.priority,
      dueDate: parsedInput.dueDate?.toISOString(),
      status: parsedInput.status,
    },
  };

  res.status(200).json({
    success: true,
    data: response,
  });
};
  // Helper method to map Task entity to response DTO
  private mapToResponseDTO(task: Task): TaskResponseDTO {
    return {
      id: task.id!,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate?.toISOString(),
      createdAt: task.createdAt!.toISOString(),
      updatedAt: task.updatedAt!.toISOString(),
      isOverdue: task.isOverdue(),
    };
  }
}