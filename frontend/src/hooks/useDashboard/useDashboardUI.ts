import { useCallback } from 'react';
import type { Task } from '@/types';

interface UseDashboardUIProps {
    showTaskForm: boolean;
    setShowTaskForm: (show: boolean) => void;
    setEditingTask: (task: Task | null) => void;
}

/**
 * useDashboardUI Hook
 * 
 * Handles UI-related state operations.
 * Manages modal states, form visibility, etc.
 * 
 * @param props - UI state and setters
 * @returns UI operation handlers
 */
export const useDashboardUI = ({
    // showTaskForm,
    setShowTaskForm,
    setEditingTask,
}: UseDashboardUIProps) => {
    /**
     * Handle task form close
     */
    const handleCloseTaskForm = useCallback(() => {
        setShowTaskForm(false);
        setEditingTask(null);
    }, [setShowTaskForm, setEditingTask]);

    return {
        handleCloseTaskForm,
    };
};