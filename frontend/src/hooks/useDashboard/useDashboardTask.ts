import { useCallback } from 'react';
import { toast } from 'sonner';
import type { CreateTaskDTO, UpdateTaskDTO, Task } from '@/types';
import type { useTaskStore } from '@/stores/useTaskStore';

interface UseDashboardTasksProps {
    taskStore: ReturnType<typeof useTaskStore.getState>;
    setShowTaskForm: (show: boolean) => void;
    setEditingTask: (task: Task | null) => void;
    deleteConfirmation: { isOpen: boolean; taskId: string | null };
    setDeleteConfirmation: (state: { isOpen: boolean; taskId: string | null }) => void;
}

/**
 * useDashboardTasks Hook
 * 
 * Handles all task-related operations (CRUD).
 * Separated from main dashboard hook for better organization.
 * 
 * @param props - Task store and UI setters
 * @returns Task operation handlers
 */
export const useDashboardTasks = ({
    taskStore,
    setShowTaskForm,
    setEditingTask,
    deleteConfirmation,
    setDeleteConfirmation,
}: UseDashboardTasksProps) => {
    const { createTask, updateTask, deleteTask } = taskStore;

    // create task
    const handleCreateTask = useCallback(
        async (data: CreateTaskDTO) => {
            try {
                await createTask(data);
                toast.success('Task created successfully');
                setShowTaskForm(false);
            } catch (err) {
                toast.error('Task creation failed');
                console.log('Create task error:', err);
            }
        },
        [createTask, setShowTaskForm]
    );

    // update task
    const handleUpdateTask = useCallback(
        async (id: string, data: UpdateTaskDTO) => {
            try {
                await updateTask(id, data);
                toast.success('Task updated successfully');
                setShowTaskForm(false);
                setEditingTask(null);
            } catch (err) {
                toast.error('Task update failed');
                console.log('Update task error:', err);
            }
        },
        [updateTask, setShowTaskForm, setEditingTask]
    );

    // delete task
    const handleDeleteTask = useCallback(
        (id: string) => {
            setDeleteConfirmation({ isOpen: true, taskId: id });
        },
        [setDeleteConfirmation]
    );

    // confirm delete
    const confirmDelete = useCallback(async () => {
        if (!deleteConfirmation.taskId) return;

        try {
            await deleteTask(deleteConfirmation.taskId);
            toast.success('Task deleted successfully');
        } catch (err) {
            toast.error('Task deletion failed');
            console.log('Delete task error:', err);
        } finally {
            setDeleteConfirmation({ isOpen: false, taskId: null });
        }
    }, [deleteTask, deleteConfirmation.taskId, setDeleteConfirmation]);

    // edit task
    const handleEditTask = useCallback(
        (task: Task) => {
            setEditingTask(task);
            setShowTaskForm(true);
        },
        [setEditingTask, setShowTaskForm]
    );

    return {
        handleCreateTask,
        handleUpdateTask,
        handleDeleteTask,
        confirmDelete,
        handleEditTask,
    };
};