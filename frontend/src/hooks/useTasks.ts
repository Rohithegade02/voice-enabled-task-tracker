import { useState, useCallback } from 'react';
import type { Task, CreateTaskDTO, UpdateTaskDTO, TaskFilters } from '@/types/task';
import { taskApi } from '@/services/api/taskApi';

export const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = useCallback(async (filters?: TaskFilters) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await taskApi.getTasks(filters);
            setTasks(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createTask = useCallback(async (data: CreateTaskDTO) => {
        setIsLoading(true);
        setError(null);
        try {
            const newTask = await taskApi.createTask(data);
            setTasks((prev) => [newTask, ...prev]);
            return newTask;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to create task';
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateTask = useCallback(async (id: string, data: UpdateTaskDTO) => {
        setIsLoading(true);
        setError(null);
        try {
            const updatedTask = await taskApi.updateTask(id, data);
            setTasks((prev) => prev.map((task) => (task.id === id ? updatedTask : task)));
            return updatedTask;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update task';
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const deleteTask = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await taskApi.deleteTask(id);
            setTasks((prev) => prev.filter((task) => task.id !== id));
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to delete task';
            setError(message);
            throw new Error(message);
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
    };
};
