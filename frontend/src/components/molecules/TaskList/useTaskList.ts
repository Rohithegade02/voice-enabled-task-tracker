import { useCallback } from 'react';
import type { Task } from '@/types';

/**
 * Hook Props Interface
 */
interface UseTaskListProps {
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    onClick?: (task: Task) => void;
}

/**
 * Hook Return Interface
 */
interface UseTaskListReturn {
    handleTaskClick: (task: Task) => void;
    handleTaskEdit: (task: Task, e: React.MouseEvent) => void;
    handleTaskDelete: (id: string, e: React.MouseEvent) => void;
}

/**
 * useTaskList Hook
 * 
 * Business logic for TaskList molecule component.
 * Handles list item interactions including click, edit, and delete.
 * 
 * @param props - Hook configuration
 * @returns Task list event handlers
 * 
 * @example
 * const { handleTaskClick, handleTaskEdit, handleTaskDelete } = useTaskList({
 *   onEdit,
 *   onDelete,
 *   onClick
 * });
 */
export const useTaskList = ({
    onEdit,
    onDelete,
    onClick,
}: UseTaskListProps): UseTaskListReturn => {
    /**
     * Handle task item click
     */
    const handleTaskClick = useCallback(
        (task: Task) => {
            onClick?.(task);
        },
        [onClick]
    );

    /**
     * Handle task edit action
     * Stops event propagation to prevent triggering onClick
     */
    const handleTaskEdit = useCallback(
        (task: Task, e: React.MouseEvent) => {
            e.stopPropagation();
            onEdit(task);
        },
        [onEdit]
    );

    /**
     * Handle task delete action
     * Stops event propagation to prevent triggering onClick
     */
    const handleTaskDelete = useCallback(
        (id: string, e: React.MouseEvent) => {
            e.stopPropagation();
            onDelete(id);
        },
        [onDelete]
    );

    return {
        handleTaskClick,
        handleTaskEdit,
        handleTaskDelete,
    };
};
