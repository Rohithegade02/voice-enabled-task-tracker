import { useCallback } from 'react';
import type { Task } from '@/types';

/**
 * Hook Props Interface
 */
interface UseTaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    onClick?: (task: Task) => void;
}

/**
 * Hook Return Interface
 */
interface UseTaskCardReturn {
    handleEdit: () => void;
    handleDelete: () => void;
    handleCardClick: (e: React.MouseEvent) => void;
}

/**
 * useTaskCard Hook
 * 
 * Business logic for TaskCard molecule component.
 * Handles card interactions including edit, delete, and click events.
 * 
 * @param props - Hook configuration
 * @returns Card event handlers
 * 
 * @example
 * const { handleEdit, handleDelete, handleCardClick } = useTaskCard({
 *   task,
 *   onEdit,
 *   onDelete,
 *   onClick
 * });
 */
export const useTaskCard = ({
    task,
    onEdit,
    onDelete,
    onClick,
}: UseTaskCardProps): UseTaskCardReturn => {
    /**
     * Handle edit action
     */
    const handleEdit = useCallback(() => {
        onEdit(task);
    }, [task, onEdit]);

    /**
     * Handle delete action
     */
    const handleDelete = useCallback(() => {
        onDelete(task.id);
    }, [task.id, onDelete]);

    /**
     * Handle card click
     * Prevents click event if clicking on buttons or dropdown
     */
    const handleCardClick = useCallback(
        (e: React.MouseEvent) => {
            // Don't trigger onClick if clicking on buttons or dropdown
            if ((e.target as HTMLElement).closest('button')) {
                return;
            }
            onClick?.(task);
        },
        [task, onClick]
    );

    return {
        handleEdit,
        handleDelete,
        handleCardClick,
    };
};
