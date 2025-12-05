import React, { useState, useEffect } from 'react';
import { TaskDetailPresentation } from './TaskDetailPresentation';
import { useTasks } from '@/hooks';
import { type UpdateTaskDTO } from '@/types';
import { ConfirmDialog } from '@/components/molecules';

interface TaskDetailContainerProps {
    taskId: string;
    onBack: () => void;
}

export const TaskDetailContainer: React.FC<TaskDetailContainerProps> = ({
    taskId,
    onBack,
}) => {
    const { tasks, updateTask, deleteTask, fetchTasks, isLoading, error } = useTasks();
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Find task from local state or fetch if needed
    // Note: In a real app with routing, we might fetch by ID specifically
    const task = tasks.find(t => t.id === taskId);

    useEffect(() => {
        if (!task && !isLoading) {
            fetchTasks();
        }
    }, [task, isLoading, fetchTasks]);

    const handleUpdate = async (data: UpdateTaskDTO) => {
        try {
            await updateTask(taskId, data);
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to update task:', err);
        }
    };

    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteTask(taskId);
            setShowDeleteConfirm(false);
            onBack();
        } catch (err) {
            console.error('Failed to delete task:', err);
            setShowDeleteConfirm(false);
        }
    };

    if (!task) {
        return <div>Task not found</div>;
    }

    return (
        <React.Fragment>
            <TaskDetailPresentation
                task={task}
                isLoading={isLoading}
                error={error}
                isEditing={isEditing}
                onBack={onBack}
                onEdit={() => setIsEditing(true)}
                onCancelEdit={() => setIsEditing(false)}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
            />

            <ConfirmDialog
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDelete}
                title="Delete Task"
                description="Are you sure you want to delete this task? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isDestructive
            />
        </React.Fragment>
    );
};
