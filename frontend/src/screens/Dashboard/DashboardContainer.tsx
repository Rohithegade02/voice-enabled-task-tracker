import React, { useState, useEffect, useCallback } from 'react';
import { DashboardPresentation } from './DashboardPresentation';
import { useTasks, useFilters, useDebounce, useVoiceParsing } from '@/hooks';
import type { CreateTaskDTO, UpdateTaskDTO, Task } from '@/types/task';
import { toast } from "sonner";

export const DashboardContainer: React.FC = () => {
    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    // Hooks
    const { filters, setFilters, clearFilters } = useFilters();
    const debouncedSearch = useDebounce(filters.search, 500);
    const { tasks, isLoading, error, fetchTasks, createTask, updateTask, deleteTask } = useTasks();
    const { parseVoice, parsedData, isLoading: isParsingVoice, resetParsing } = useVoiceParsing();

    // Fetch tasks when filters change
    useEffect(() => {
        fetchTasks({ ...filters, search: debouncedSearch });
    }, [fetchTasks, filters.status, filters.priority, filters.dueDateFrom, filters.dueDateTo, debouncedSearch]);

    // Handlers
    const handleCreateTask = async (data: CreateTaskDTO) => {
        try {
            await createTask(data);
            toast.success("Task created successfully");
            setShowTaskForm(false);
        } catch (err) {
            toast.error("Failed to create task");
        }
    };

    const handleUpdateTask = async (id: string, data: UpdateTaskDTO) => {
        try {
            await updateTask(id, data);
            toast.success("Task updated successfully");
            setShowTaskForm(false);
            setEditingTask(null);
        } catch (err) {
            toast.error("Failed to update task");
        }
    };

    const handleDeleteTask = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await deleteTask(id);
                toast.success("Task deleted successfully");
            } catch (err) {
                toast.error("Failed to delete task");
            }
        }
    };

    const handleVoiceRecordingComplete = async (audioBlob: Blob) => {
        setShowVoiceRecorder(false);
        try {
            await parseVoice(audioBlob);
        } catch (err) {
            toast.error("Failed to parse voice input");
        }
    };

    const handleVoiceParseConfirm = async (data: any) => {
        try {
            await createTask(data);
            resetParsing();
            toast.success("Task created from voice input");
        } catch (err) {
            toast.error("Failed to create task");
        }
    };

    const handleEditTask = useCallback((task: Task) => {
        setEditingTask(task);
        setShowTaskForm(true);
    }, []);

    const handleCloseTaskForm = useCallback(() => {
        setShowTaskForm(false);
        setEditingTask(null);
    }, []);

    const handleOpenTaskForm = useCallback(() => {
        setShowTaskForm(true);
    }, []);

    const handleOpenVoiceRecorder = useCallback(() => {
        setShowVoiceRecorder(true);
    }, []);

    const handleCloseVoiceRecorder = useCallback(() => {
        setShowVoiceRecorder(false);
    }, []);

    const handleCloseVoicePreview = useCallback(() => {
        resetParsing();
    }, []);

    return (
        <DashboardPresentation
            tasks={tasks}
            isLoading={isLoading}
            error={error}
            viewMode={viewMode}
            filters={filters}
            showTaskForm={showTaskForm}
            showVoiceRecorder={showVoiceRecorder}
            parsedVoiceData={parsedData}
            isParsingVoice={isParsingVoice}
            editingTask={editingTask}
            onViewModeChange={setViewMode}
            onFilterChange={setFilters}
            onClearFilters={clearFilters}
            onCreateTask={handleCreateTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onVoiceRecordingComplete={handleVoiceRecordingComplete}
            onVoiceParseConfirm={handleVoiceParseConfirm}
            onOpenTaskForm={handleOpenTaskForm}
            onCloseTaskForm={handleCloseTaskForm}
            onOpenVoiceRecorder={handleOpenVoiceRecorder}
            onCloseVoiceRecorder={handleCloseVoiceRecorder}
            onCloseVoicePreview={handleCloseVoicePreview}
            onEditTask={handleEditTask}
        />
    );
};
