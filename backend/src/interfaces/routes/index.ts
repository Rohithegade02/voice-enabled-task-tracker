import { Router } from 'express';
import { createTaskRoutes } from './taskRoutes';
import { TaskController } from '../controllers/TaskController';

export const createRoutes = (taskController: TaskController): Router => {
  const router = Router();

  // Health check
  router.get('/health', (req, res) => {
    res.json({
      success: true,
      status: 'ok',
      service: 'voice-enabled-task-tracker-backend',
      timestamp: new Date().toISOString(),
    });
  });

  // Task routes
  router.use('/tasks', createTaskRoutes(taskController));

  return router;
};
