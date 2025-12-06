import { useState, useCallback } from 'react';
import {
    type DragEndEvent,
    type DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { type Task, TaskStatus } from '@/types';
import type { useTaskStore } from '@/stores/useTaskStore';

interface UseDashboardDnDProps {
    tasks: Task[];
    taskStore: ReturnType<typeof useTaskStore.getState>;
}

export const useDashboardDnD = ({ tasks, taskStore }: UseDashboardDnDProps) => {
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
        taskStore.updateTask(id, { status });
    }, [taskStore]);

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
            const task = tasks.find(t => t.id === taskId);

            if (task && task.status !== newStatus) {
                // OPTIMISTIC UPDATE: Update UI immediately
                const optimisticTask = { ...task, status: newStatus };
                const optimisticTasks = tasks.map(t =>
                    t.id === taskId ? optimisticTask : t
                );

                taskStore.tasks = optimisticTasks;

                // Then make the API call
                handleStatusChange(taskId, newStatus);
            }
        }

        setActiveTask(null);
    }, [tasks, taskStore, handleStatusChange]);

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
