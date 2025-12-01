import express, { Application } from 'express';
import cors from 'cors';
import { errorHandler } from './interfaces/middleware/errorHandler';
import { createRoutes } from './interfaces/routes';
import { TaskController } from './interfaces/controllers/TaskController';

// Dependency Injection Container
import { TaskRepository } from './infrastructure/database/repositories/TaskRepository';
import { VoiceParsingService } from './infrastructure/services/VoiceParsingService';
import { CreateTaskUseCase } from './domain/usecases/CreateTask';
import { GetTasksUseCase } from './domain/usecases/GetTasks';
import { GetTaskByIdUseCase } from './domain/usecases/GetTaskById';
import { UpdateTaskUseCase } from './domain/usecases/UpdateTask';
import { DeleteTaskUseCase } from './domain/usecases/DeleteTask';
import { ParseVoiceInputUseCase } from './domain/usecases/ParseVoiceInput';

export const createApp = async (): Promise<Application> => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
  app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies

  // Dependency Injection - Manual wiring (Clean Architecture)
  // Infrastructure layer
  const taskRepository = new TaskRepository();
  const voiceParsingService = new VoiceParsingService();

  // Domain layer - Use cases
  const createTaskUseCase = new CreateTaskUseCase(taskRepository);
  const getTasksUseCase = new GetTasksUseCase(taskRepository);
  const getTaskByIdUseCase = new GetTaskByIdUseCase(taskRepository);
  const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
  const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);
  const parseVoiceInputUseCase = new ParseVoiceInputUseCase(voiceParsingService);

  // Interface layer - Controller
  const taskController = new TaskController(
    createTaskUseCase,
    getTasksUseCase,
    getTaskByIdUseCase,
    updateTaskUseCase,
    deleteTaskUseCase,
    parseVoiceInputUseCase
  );

  // Routes
  app.use('/api', createRoutes(taskController));

  // Error handling middleware (must be last)
  app.use(errorHandler);

  return app;
};