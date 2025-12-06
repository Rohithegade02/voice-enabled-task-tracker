import { useState, useCallback } from 'react';
import {
    type DragEndEvent,
    type DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { type Task, TaskStatus, type UpdateTaskDTO } from '@/types';

interface UseDashboardDnDProps {
    tasks: Task[];
    onUpdateTask: (id: string, data: UpdateTaskDTO) => void;
}

export const useDashboardDnD = ({ tasks, onUpdateTask }: UseDashboardDnDProps) => {
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    // Configure drag sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleStatusChange = useCallback((id: string, status: TaskStatus) => {
        onUpdateTask(id, { status });
    }, [onUpdateTask]);

    const handleDragStart = useCallback((event: DragStartEvent) => {
        const { active } = event;
        const task = tasks?.find(t => t.id === active.id);
        setActiveTask(task || null);
    }, [tasks]);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            setActiveTask(null);
            return;
        }

        const taskId = active.id as string;
        const newStatus = over.id as TaskStatus;

        if (newStatus && Object.values(TaskStatus).includes(newStatus)) {
            handleStatusChange(taskId, newStatus);
        }

        setActiveTask(null);
    }, [handleStatusChange]);

    const handleDragCancel = useCallback(() => {
        setActiveTask(null);
    }, []);

    return {
        activeTask,
        sensors,
        handleDragStart,
        handleDragEnd,
        handleDragCancel,
        handleStatusChange,
    };
};
