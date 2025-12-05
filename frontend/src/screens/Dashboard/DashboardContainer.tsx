import React, { useState, useEffect, useCallback } from 'react';
import { DashboardPresentation } from './DashboardPresentation';
import { useTasks, useFilters, useDebounce, useVoiceParsing } from '@/hooks';
import type { CreateTaskDTO, UpdateTaskDTO, Task } from '@/types';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/molecules';

export const DashboardContainer: React.FC = () => {
    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
    const [showTaskForm, setShowTaskForm] = useState<boolean>(false);
    const [showVoiceRecorder, setShowVoiceRecorder] = useState<boolean>(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; taskId: string | null }>({
        isOpen: false,
        taskId: null,
    });

    // Hooks
    const { filters, setFilters, clearFilters } = useFilters();
    const debouncedSearch = useDebounce(filters?.search, 500);
    const { tasks, isLoading, error, fetchTasks, createTask, updateTask, deleteTask, clearError } = useTasks();
    const {
        parseVoice,
        parsedData,
        isLoading: isParsingVoice,
        error: voiceError,
        resetParsing,
        clearError: clearVoiceError
    } = useVoiceParsing();

    // Fetch tasks when filters change
    useEffect(() => {
        const filtersWithSearch = { ...filters, search: debouncedSearch };
        fetchTasks(filtersWithSearch);
    }, [fetchTasks, filters.status, filters.priority, filters.dueDateFrom, filters.dueDateTo, debouncedSearch]);

    // Display error toasts
    useEffect(() => {
        if (error) {
            toast.error(error);
            clearError();
        }
    }, [error, clearError]);

    useEffect(() => {
        if (voiceError) {
            toast.error(voiceError);
            clearVoiceError();
        }
    }, [voiceError, clearVoiceError]);

    // Handlers
    const handleCreateTask = useCallback(async (data: CreateTaskDTO) => {
        try {
            await createTask(data);
            toast.success('Task created successfully');
            setShowTaskForm(false);
        } catch (err) {
            // Error already handled by hook and displayed via toast
            console.error(' Create task error:', err);
        }
    }, [createTask, setShowTaskForm]);

    const handleUpdateTask = useCallback(async (id: string, data: UpdateTaskDTO) => {
        try {
            await updateTask(id, data);
            toast.success('Task updated successfully');
            setShowTaskForm(false);
            setEditingTask(null);
        } catch (err) {
            // Error already handled by hook and displayed via toast
            console.error(' Update task error:', err);
        }
    }, [updateTask, setShowTaskForm, setEditingTask]);

    const handleDeleteTask = useCallback((id: string) => {
        setDeleteConfirmation({ isOpen: true, taskId: id });
    }, []);

    const confirmDelete = useCallback(async () => {
        if (!deleteConfirmation.taskId) return;

        try {
            await deleteTask(deleteConfirmation.taskId);
            toast.success('Task deleted successfully');
        } catch (err) {
            // Error already handled by hook and displayed via toast
            console.error(' Delete task error:', err);
        } finally {
            setDeleteConfirmation({ isOpen: false, taskId: null });
        }
    }, [deleteTask, deleteConfirmation.taskId]);

    const handleVoiceRecordingComplete = useCallback(async (audioBlob: Blob) => {
        setShowVoiceRecorder(false);

        try {
            await parseVoice(audioBlob);
            // Success - parsedData will be set and modal will open
        } catch (err) {
            // Error already handled by hook and displayed via toast
            console.error(' Voice parsing error:', err);
        }
    }, [parseVoice, setShowVoiceRecorder]);

    const handleVoiceParseConfirm = useCallback(async (data: CreateTaskDTO) => {
        try {
            await createTask(data);
            resetParsing();
            toast.success('Task created from voice input');
        } catch (err) {
            // Error already handled by hook and displayed via toast
            console.error(' Voice task creation error:', err);
        }
    }, [createTask, resetParsing]);

    const handleEditTask = useCallback((task: Task) => {
        setEditingTask(task);
        setShowTaskForm(true);
    }, [setEditingTask, setShowTaskForm]);

    const handleCloseTaskForm = useCallback(() => {
        setShowTaskForm(false);
        setEditingTask(null);
    }, [setShowTaskForm]);

    const handleFilterChange = useCallback((newFilters: typeof filters) => {
        setFilters(newFilters);
    }, [setFilters]);

    return (
        <React.Fragment>
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
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                onCreateTask={handleCreateTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onVoiceRecordingComplete={handleVoiceRecordingComplete}
                onVoiceParseConfirm={handleVoiceParseConfirm}
                onOpenTaskForm={() => setShowTaskForm(true)}
                onCloseTaskForm={handleCloseTaskForm}
                onOpenVoiceRecorder={() => setShowVoiceRecorder(true)}
                onCloseVoiceRecorder={() => setShowVoiceRecorder(false)}
                onCloseVoicePreview={resetParsing}
                onEditTask={handleEditTask}
            />

            <ConfirmDialog
                isOpen={deleteConfirmation.isOpen}
                onClose={() => setDeleteConfirmation({ isOpen: false, taskId: null })}
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
