import { useState, useCallback } from 'react';
import type { Task, CreateTaskDTO, UpdateTaskDTO, TaskFilters } from '@/types';
import { taskApi, getErrorMessage } from '@/services/api';

interface UseTasksReturn {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;
    fetchTasks: (filters?: TaskFilters) => Promise<void>;
    createTask: (data: CreateTaskDTO) => Promise<Task>;
    updateTask: (id: string, data: UpdateTaskDTO) => Promise<Task>;
    deleteTask: (id: string) => Promise<void>;
    clearError: () => void;
}

/**
 * Custom hook for managing task state and operations
 * Provides CRUD operations with loading and error states
 */
export const useTasks = (): UseTasksReturn => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const fetchTasks = useCallback(async (filters?: TaskFilters) => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await taskApi.getTasks(filters);
            setTasks(data);
        } catch (err) {
            const message = getErrorMessage(err);
            setError(message);
            console.error('Fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createTask = useCallback(async (data: CreateTaskDTO): Promise<Task> => {
        setIsLoading(true);
        setError(null);

        try {
            const newTask = await taskApi.createTask(data);
            setTasks((prev) => [newTask, ...prev]);
            return newTask;
        } catch (err) {
            const message = getErrorMessage(err);
            setError(message);
            console.error('Create error:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateTask = useCallback(async (id: string, data: UpdateTaskDTO): Promise<Task> => {
        // Optimistic update - update UI immediately
        const previousTasks = [...tasks];
        const taskIndex = tasks.findIndex(t => t.id === id);

        if (taskIndex !== -1) {
            const optimisticTask = { ...tasks[taskIndex], ...data };
            const newTasks = [...tasks];
            newTasks[taskIndex] = optimisticTask;
            setTasks(newTasks);
        }

        try {
            const updatedTask = await taskApi.updateTask(id, data);
            // Update with actual server response
            setTasks((prev) => prev.map((task) => (task.id === id ? updatedTask : task)));
            return updatedTask;
        } catch (err) {
            // Rollback on error
            setTasks(previousTasks);
            const message = getErrorMessage(err);
            setError(message);
            console.error('Update error:', err);
            throw err;
        }
    }, [tasks]);

    const deleteTask = useCallback(async (id: string): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            await taskApi.deleteTask(id);
            setTasks((prev) => prev.filter((task) => task.id !== id));
        } catch (err) {
            const message = getErrorMessage(err);
            setError(message);
            console.error('Delete error:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        tasks,
        isLoading,
        error,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        clearError,
    };
};
