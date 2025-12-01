import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { asyncHandler } from '../middleware/errorHandler';
import { validateCreateTask, validateUpdateTask, validateTaskId } from '../middleware/validators';
import { upload } from '../middleware/upload';

export const createTaskRoutes = (taskController: TaskController): Router => {
  const router = Router();

  // POST /api/tasks - Create task manually
  router.post(
    '/',
    validateCreateTask,
    asyncHandler(taskController.createTask)
  );

  // GET /api/tasks - Get all tasks with optional filters
  // Query params: ?status=To Do&priority=High&search=keyword&dueDateFrom=2024-01-01&dueDateTo=2024-12-31
  router.get('/', asyncHandler(taskController.getTasks));

  // GET /api/tasks/:id - Get single task
  router.get('/:id', validateTaskId, asyncHandler(taskController.getTaskById));

  // PUT /api/tasks/:id - Update task
  router.put(
    '/:id',
    validateTaskId,
    validateUpdateTask,
    asyncHandler(taskController.updateTask)
  );

  // DELETE /api/tasks/:id - Delete task
  router.delete('/:id', validateTaskId, asyncHandler(taskController.deleteTask));

  // POST /api/tasks/parse-voice - Parse voice input
  router.post(
    '/parse-voice',
    upload.single('audio'),
    asyncHandler(taskController.parseVoiceInput)
  );

  return router;
};