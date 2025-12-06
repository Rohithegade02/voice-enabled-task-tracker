import { useState } from 'react';
import { useTaskStore, useFilterStore, useVoiceStore } from '@/stores';
import { useDashboardTasks } from './useDashboardTask';
import { useDashboardVoice } from './useDashboardVoice';
import { useDashboardFilters } from './useDashboardFilter';
import { useDashboardUI } from './useDashboardUI';
import type { Task } from '@/types';

export interface UseDashboardReturn {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;
    filters: ReturnType<typeof useFilterStore.getState>['filters'];
    parsedVoiceData: ReturnType<typeof useVoiceStore.getState>['parsedData'];
    isParsingVoice: boolean;
    voiceError: string | null;
    viewMode: 'kanban' | 'list';
    showTaskForm: boolean;
    showVoiceRecorder: boolean;
    editingTask: Task | null;
    deleteConfirmation: { isOpen: boolean; taskId: string | null };
    handleCreateTask: ReturnType<typeof useDashboardTasks>['handleCreateTask'];
    handleUpdateTask: ReturnType<typeof useDashboardTasks>['handleUpdateTask'];
    handleDeleteTask: ReturnType<typeof useDashboardTasks>['handleDeleteTask'];
    confirmDelete: ReturnType<typeof useDashboardTasks>['confirmDelete'];
    handleEditTask: ReturnType<typeof useDashboardTasks>['handleEditTask'];
    handleVoiceRecordingComplete: ReturnType<typeof useDashboardVoice>['handleVoiceRecordingComplete'];
    handleVoiceParseConfirm: ReturnType<typeof useDashboardVoice>['handleVoiceParseConfirm'];
    setViewMode: (mode: 'kanban' | 'list') => void;
    handleFilterChange: ReturnType<typeof useDashboardFilters>['handleFilterChange'];
    clearFilters: ReturnType<typeof useDashboardFilters>['clearFilters'];
    setShowTaskForm: (show: boolean) => void;
    setShowVoiceRecorder: (show: boolean) => void;
    handleCloseTaskForm: () => void;
    setDeleteConfirmation: (state: { isOpen: boolean; taskId: string | null }) => void;
}

/**
 * useDashboard Hook
 * 
 * Main orchestrator for Dashboard screen.
 * Composes smaller hooks to manage tasks, filters, voice, and UI.
 * 
 * @returns Dashboard state and handlers
 * 
 * @example
 * const {
 *   tasks,
 *   isLoading,
 *   viewMode,
 *   handleCreateTask,
 *   handleFilterChange
 * } = useDashboard();
 */
export const useDashboard = (): UseDashboardReturn => {
    // Zustand stores
    const taskStore = useTaskStore();
    const filterStore = useFilterStore();
    const voiceStore = useVoiceStore();

    // Local UI state
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

    // UI actions
    const uiActions = useDashboardUI({
        showTaskForm,
        setShowTaskForm,
        setEditingTask,
    });

    // Task operations
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

    // Filter operations
    const filterOperations = useDashboardFilters({
        filterStore,
        taskStore,
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
    };
};