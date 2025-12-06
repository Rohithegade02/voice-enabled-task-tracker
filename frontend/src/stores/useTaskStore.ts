import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { taskApi } from '@/services/api';
import type { Task, CreateTaskDTO, UpdateTaskDTO, TaskFilters } from '@/types';

/**
 * Task Store State Interface
 */
interface TaskState {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;
    fetchTasks: (filters?: TaskFilters) => Promise<void>;
    createTask: (data: CreateTaskDTO) => Promise<Task>;
    updateTask: (id: string, data: UpdateTaskDTO) => Promise<Task>;
    deleteTask: (id: string) => Promise<void>;
    clearError: () => void;
    resetStore: () => void;
}

// initial values
const initialState = {
    tasks: [],
    isLoading: false,
    error: null,
};

/**
 * Task Store - Manages all task-related state and operations
 */
export const useTaskStore = create<TaskState>()(
    devtools(
        (set) => ({
            ...initialState,

            fetchTasks: async (filters?: TaskFilters) => {
                set({ isLoading: true, error: null }, false, 'fetchTasks/start');

                try {
                    const tasks = await taskApi.getTasks(filters);
                    set(
                        { tasks, isLoading: false, error: null },
                        false,
                        'fetchTasks/success'
                    );
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tasks';
                    set(
                        { isLoading: false, error: errorMessage },
                        false,
                        'fetchTasks/error'
                    );
                    throw error;
                }
            },
            createTask: async (data: CreateTaskDTO) => {
                set({ isLoading: true, error: null }, false, 'createTask/start');

                try {
                    const newTask = await taskApi.createTask(data);
                    set(
                        (state) => ({
                            tasks: [...state.tasks, newTask],
                            isLoading: false,
                            error: null,
                        }),
                        false,
                        'createTask/success'
                    );
                    return newTask;
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to create task';
                    set(
                        { isLoading: false, error: errorMessage },
                        false,
                        'createTask/error'
                    );
                    throw error;
                }
            },
            updateTask: async (id: string, data: UpdateTaskDTO) => {
                set({ isLoading: true, error: null }, false, 'updateTask/start');

                try {
                    const updatedTask = await taskApi.updateTask(id, data);
                    set(
                        (state) => ({
                            tasks: state.tasks.map((task) =>
                                task.id === id ? updatedTask : task
                            ),
                            isLoading: false,
                            error: null,
                        }),
                        false,
                        'updateTask/success'
                    );
                    return updatedTask;
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to update task';
                    set(
                        { isLoading: false, error: errorMessage },
                        false,
                        'updateTask/error'
                    );
                    throw error;
                }
            },
            deleteTask: async (id: string) => {
                set({ isLoading: true, error: null }, false, 'deleteTask/start');

                try {
                    await taskApi.deleteTask(id);
                    set(
                        (state) => ({
                            tasks: state.tasks.filter((task) => task.id !== id),
                            isLoading: false,
                            error: null,
                        }),
                        false,
                        'deleteTask/success'
                    );
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to delete task';
                    set(
                        { isLoading: false, error: errorMessage },
                        false,
                        'deleteTask/error'
                    );
                    throw error;
                }
            },
            clearError: () => {
                set({ error: null }, false, 'clearError');
            },
            resetStore: () => {
                set(initialState, false, 'resetStore');
            },
        }),
        { name: 'TaskStore' }
    )
);

// selectors
export const useTasksSelector = () => useTaskStore((state) => state.tasks);
export const useTaskLoadingSelector = () => useTaskStore((state) => state.isLoading);
export const useTaskErrorSelector = () => useTaskStore((state) => state.error);
