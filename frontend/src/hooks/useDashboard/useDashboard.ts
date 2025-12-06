import { useState } from 'react';
import { useTaskStore, useFilterStore, useVoiceStore } from '@/stores';
import { useDashboardTasks } from './useDashboardTask';
import { useDashboardVoice } from './useDashboardVoice';
import { useDashboardFilters } from './useDashboardFilter';
import { useDashboardUI } from './useDashboardUI';
import { useDashboardDnD } from './useDashboardDnD';
import type { Task } from '@/types';
import type { UseDashboardReturn } from '@/screens/Dashboard/types';


/**
 * useDashboard Hook
 * 
 * Main orchestrator for Dashboard screen.
 * Composes smaller hooks to manage tasks, filters, voice, and UI.
 *
 */
export const useDashboard = (): UseDashboardReturn => {
    const taskStore = useTaskStore();
    const filterStore = useFilterStore();
    const voiceStore = useVoiceStore();

    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{
        isOpen: boolean;
        taskId: string | null;
    }>({
        isOpen: false,
        taskId: null,
    });

    const uiActions = useDashboardUI({
        showTaskForm,
        setShowTaskForm,
        setEditingTask,
        deleteConfirmation,
        setDeleteConfirmation,
    });

    const taskOperations = useDashboardTasks({
        taskStore,
        setShowTaskForm,
        setEditingTask,
        deleteConfirmation,
        setDeleteConfirmation,
    });
    // Voice operations
    const voiceOperations = useDashboardVoice({
        voiceStore,
        taskStore,
        setShowVoiceRecorder,
    });

    const filterOperations = useDashboardFilters({
        filterStore,
        taskStore,
    });
    const dndOperations = useDashboardDnD({
        tasks: taskStore.tasks,
        onUpdateTask: taskOperations.handleUpdateTask,
    });

    return {
        tasks: taskStore.tasks,
        isLoading: taskStore.isLoading,
        error: taskStore.error,
        filters: filterStore.filters,
        parsedVoiceData: voiceStore.parsedData,
        isParsingVoice: voiceStore.isLoading,
        voiceError: voiceStore.error,
        viewMode,
        showTaskForm,
        showVoiceRecorder,
        editingTask,
        deleteConfirmation,
        ...taskOperations,
        ...voiceOperations,
        setViewMode,
        ...filterOperations,
        setShowTaskForm,
        setShowVoiceRecorder,
        handleCloseTaskForm: uiActions.handleCloseTaskForm,
        setDeleteConfirmation,
        onCloseDeleteConfirmation: uiActions.onCloseDeleteConfirmation,
        onCloseVoicePreview: voiceOperations.onCloseVoicePreview,
        ...dndOperations,
    };
};