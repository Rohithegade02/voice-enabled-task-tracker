import React, { useState, useEffect } from 'react';
import { TaskDetailPresentation } from './TaskDetailPresentation';
import { useTasks } from '@/hooks';
import { UpdateTaskDTO } from '@/types';

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

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await deleteTask(taskId);
                onBack();
            } catch (err) {
                console.error('Failed to delete task:', err);
            }
        }
    };

    if (!task) {
        return <div>Task not found</div>;
    }

    return (
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
    );
};
