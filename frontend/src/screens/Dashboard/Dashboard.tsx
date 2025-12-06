import React, { memo } from 'react';
import { DashboardPresentation } from './DashboardPresentation';
import { ConfirmDialog } from '@/components/molecules';
import { useDashboard } from '../../hooks/useDashboard';

/**
 * Dashboard Screen Component
 * 
 * Main dashboard view with task management, filtering, and voice input capabilities.
 * Uses the useDashboard hook for all business logic and state management.
 */
export const Dashboard: React.FC = memo(() => {
    const {
        tasks,
        isLoading,
        error,
        filters,
        parsedVoiceData,
        isParsingVoice,
        viewMode,
        showTaskForm,
        showVoiceRecorder,
        editingTask,
        deleteConfirmation,
        handleCreateTask,
        handleUpdateTask,
        handleDeleteTask,
        confirmDelete,
        handleEditTask,
        handleVoiceRecordingComplete,
        handleVoiceParseConfirm,
        setViewMode,
        handleFilterChange,
        clearFilters,
        setShowTaskForm,
        setShowVoiceRecorder,
        handleCloseTaskForm,
        onCloseDeleteConfirmation,
        onCloseVoicePreview,
        activeTask,
        sensors,
        handleDragStart,
        handleDragEnd,
        handleDragCancel,
        handleStatusChange,
    } = useDashboard();

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
                parsedVoiceData={parsedVoiceData}
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
                onCloseVoicePreview={onCloseVoicePreview}
                onEditTask={handleEditTask}
                activeTask={activeTask}
                sensors={sensors}
                handleDragStart={handleDragStart}
                handleDragEnd={handleDragEnd}
                handleDragCancel={handleDragCancel}
                handleStatusChange={handleStatusChange}
            />

            <ConfirmDialog
                isOpen={deleteConfirmation.isOpen}
                onClose={onCloseDeleteConfirmation}
                onConfirm={confirmDelete}
                title="Delete Task"
                description="Are you sure you want to delete this task? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isDestructive

            />
        </React.Fragment>
    );
});

Dashboard.displayName = 'Dashboard';
