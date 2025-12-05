import React, { memo, useMemo } from 'react';
import {
    type DragEndEvent,
    type DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { type Task, type CreateTaskDTO, type UpdateTaskDTO, TaskStatus } from '@/types';
import type { DashboardPresentationProps } from './types';
import DashboardHeader from './DashboardHeader';
import DashboardFilterBar from './DashboardFilterBar';
import DashboardContent from './DashboardContent';
import DashboardModal from './DashboardModal';

export const DashboardPresentation: React.FC<DashboardPresentationProps> = memo(({
    tasks,
    isLoading,
    error,
    viewMode,
    filters,
    showTaskForm,
    showVoiceRecorder,
    parsedVoiceData,
    isParsingVoice,
    editingTask,
    onViewModeChange,
    onFilterChange,
    onClearFilters,
    onCreateTask,
    onUpdateTask,
    onDeleteTask,
    onVoiceRecordingComplete,
    onVoiceParseConfirm,
    onOpenTaskForm,
    onCloseTaskForm,
    onOpenVoiceRecorder,
    onCloseVoiceRecorder,
    onCloseVoicePreview,
    onEditTask,
}) => {
    const [activeTask, setActiveTask] = React.useState<Task | null>(null);

    // Configure drag sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    // Group tasks for Kanban view
    const todoTasks = useMemo(() => tasks?.filter(t => t.status === TaskStatus.TODO), [tasks]);
    const inProgressTasks = useMemo(() => tasks?.filter(t => t.status === TaskStatus.IN_PROGRESS), [tasks]);
    const doneTasks = useMemo(() => tasks?.filter(t => t.status === TaskStatus.DONE), [tasks]);

    const handleTaskSubmit = (data: CreateTaskDTO | UpdateTaskDTO) => {
        if (editingTask) {
            onUpdateTask(editingTask.id, data as UpdateTaskDTO);
        } else {
            onCreateTask(data as CreateTaskDTO);
        }
    };

    const handleStatusChange = (id: string, status: TaskStatus) => {
        onUpdateTask(id, { status });
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const task = tasks?.find(t => t.id === active.id);
        setActiveTask(task || null);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            setActiveTask(null);
            return;
        }

        const taskId = active.id as string;
        const newStatus = over.id as TaskStatus;

        // Update task status if dropped on a different column
        if (newStatus && Object.values(TaskStatus).includes(newStatus)) {
            handleStatusChange(taskId, newStatus);
        }

        setActiveTask(null);
    };

    const handleDragCancel = () => {
        setActiveTask(null);
    };

    const columns = useMemo(() => [
        {
            title: "To Do",
            status: TaskStatus.TODO,
            tasks: todoTasks,
        },
        {
            title: "In Progress",
            status: TaskStatus.IN_PROGRESS,
            tasks: inProgressTasks,
        },
        {
            title: "Done",
            status: TaskStatus.DONE,
            tasks: doneTasks,
        },
    ], [todoTasks, inProgressTasks, doneTasks]);

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen text-destructive">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 px-4 space-y-6 max-w-7xl">
            <DashboardHeader
                onOpenVoiceRecorder={onOpenVoiceRecorder}
                onOpenTaskForm={onOpenTaskForm}
            />
            <DashboardFilterBar
                filters={filters}
                onFilterChange={onFilterChange}
                onClearFilters={onClearFilters}
                viewMode={viewMode}
                onViewModeChange={onViewModeChange}
            />
            <DashboardContent
                isLoading={isLoading}
                tasks={tasks}
                viewMode={viewMode}
                columns={columns}
                sensors={sensors}
                handleDragStart={handleDragStart}
                handleDragEnd={handleDragEnd}
                handleDragCancel={handleDragCancel}
                activeTask={activeTask}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
                handleStatusChange={handleStatusChange}
                onOpenTaskForm={onOpenTaskForm}
                filters={filters}
            />

            {/* Modals */}
            <DashboardModal
                showTaskForm={showTaskForm}
                onCloseTaskForm={onCloseTaskForm}
                handleTaskSubmit={handleTaskSubmit}
                editingTask={editingTask}
                showVoiceRecorder={showVoiceRecorder}
                onCloseVoiceRecorder={onCloseVoiceRecorder}
                onVoiceRecordingComplete={onVoiceRecordingComplete}
                parsedVoiceData={parsedVoiceData}
                onCloseVoicePreview={onCloseVoicePreview}
                onVoiceParseConfirm={onVoiceParseConfirm}
                isParsingVoice={isParsingVoice}
            />
        </div>
    );
});
