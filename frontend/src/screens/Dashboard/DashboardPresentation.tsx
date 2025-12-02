import React from 'react';
import { type Task, type CreateTaskDTO, type UpdateTaskDTO, type TaskFilters, type ParsedVoiceInput, TaskStatus } from '@/types/task';
import { Button } from '@/components/atoms/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/atoms/tabs';
import { Plus, Mic, LayoutGrid, List as ListIcon } from 'lucide-react';
import {
    TaskForm,
    VoiceRecorder,
    VoiceParsePreview,
    FilterBar,
    KanbanColumn,
    TaskList,
    EmptyState
} from '@/components/molecules';
import { Skeleton } from '@/components/atoms/skeleton';

interface DashboardPresentationProps {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;
    viewMode: 'kanban' | 'list';
    filters: TaskFilters;
    showTaskForm: boolean;
    showVoiceRecorder: boolean;
    parsedVoiceData: ParsedVoiceInput | null;
    isParsingVoice: boolean;
    editingTask: Task | null;

    // Handlers
    onViewModeChange: (mode: 'kanban' | 'list') => void;
    onFilterChange: (filters: TaskFilters) => void;
    onClearFilters: () => void;
    onCreateTask: (data: CreateTaskDTO) => void;
    onUpdateTask: (id: string, data: UpdateTaskDTO) => void;
    onDeleteTask: (id: string) => void;
    onVoiceRecordingComplete: (audioBlob: Blob) => void;
    onVoiceParseConfirm: (data: any) => void;
    onOpenTaskForm: () => void;
    onCloseTaskForm: () => void;
    onOpenVoiceRecorder: () => void;
    onCloseVoiceRecorder: () => void;
    onCloseVoicePreview: () => void;
    onEditTask: (task: Task) => void;
}

export const DashboardPresentation: React.FC<DashboardPresentationProps> = ({
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
    // Group tasks for Kanban view
    const todoTasks = tasks.filter(t => t.status === TaskStatus.TODO);
    const inProgressTasks = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS);
    const doneTasks = tasks.filter(t => t.status === TaskStatus.DONE);

    const handleTaskSubmit = (data: CreateTaskDTO | UpdateTaskDTO) => {
        if (editingTask) {
            onUpdateTask(editingTask.id, data);
        } else {
            onCreateTask(data as CreateTaskDTO);
        }
    };

    const handleStatusChange = (id: string, status: TaskStatus) => {
        onUpdateTask(id, { status });
    };

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen text-destructive">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 px-4 space-y-6 max-w-7xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Task Tracker</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your tasks efficiently with voice commands
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={onOpenVoiceRecorder}
                        className="gap-2"
                    >
                        <Mic className="h-4 w-4" />
                        Voice Input
                    </Button>
                    <Button onClick={onOpenTaskForm} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Task
                    </Button>
                </div>
            </div>

            {/* Filters & View Toggle */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex-1 w-full md:w-auto">
                    <FilterBar
                        filters={filters}
                        onFilterChange={onFilterChange}
                        onClearFilters={onClearFilters}
                    />
                </div>

                <Tabs
                    value={viewMode}
                    onValueChange={(v) => onViewModeChange(v as 'kanban' | 'list')}
                    className="w-full md:w-auto"
                >
                    <TabsList className="grid w-full grid-cols-2 md:w-auto">
                        <TabsTrigger value="kanban" className="gap-2">
                            <LayoutGrid className="h-4 w-4" />
                            Board
                        </TabsTrigger>
                        <TabsTrigger value="list" className="gap-2">
                            <ListIcon className="h-4 w-4" />
                            List
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Content */}
            {isLoading && tasks.length === 0 ? (
                <div className="space-y-4">
                    <Skeleton className="h-[200px] w-full rounded-xl" />
                    <Skeleton className="h-[200px] w-full rounded-xl" />
                </div>
            ) : tasks.length === 0 ? (
                <EmptyState
                    title="No tasks found"
                    description={
                        Object.keys(filters).length > 0
                            ? "Try adjusting your filters or search query"
                            : "Get started by creating a new task or using voice input"
                    }
                    action={Object.keys(filters).length === 0 ? {
                        label: "Create Task",
                        onClick: onOpenTaskForm
                    } : undefined}
                />
            ) : (
                <>
                    {viewMode === 'kanban' ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-250px)] min-h-[500px]">
                            <KanbanColumn
                                title="To Do"
                                status={TaskStatus.TODO}
                                tasks={todoTasks}
                                onTaskClick={onEditTask}
                                onEditTask={onEditTask}
                                onDeleteTask={onDeleteTask}
                                onStatusChange={handleStatusChange}
                            />
                            <KanbanColumn
                                title="In Progress"
                                status={TaskStatus.IN_PROGRESS}
                                tasks={inProgressTasks}
                                onTaskClick={onEditTask}
                                onEditTask={onEditTask}
                                onDeleteTask={onDeleteTask}
                                onStatusChange={handleStatusChange}
                            />
                            <KanbanColumn
                                title="Done"
                                status={TaskStatus.DONE}
                                tasks={doneTasks}
                                onTaskClick={onEditTask}
                                onEditTask={onEditTask}
                                onDeleteTask={onDeleteTask}
                                onStatusChange={handleStatusChange}
                            />
                        </div>
                    ) : (
                        <TaskList
                            tasks={tasks}
                            onTaskClick={onEditTask}
                            onEditTask={onEditTask}
                            onDeleteTask={onDeleteTask}
                        />
                    )}
                </>
            )}

            {/* Modals */}
            <TaskForm
                isOpen={showTaskForm}
                onClose={onCloseTaskForm}
                onSubmit={handleTaskSubmit}
                initialData={editingTask || undefined}
                mode={editingTask ? 'edit' : 'create'}
            />

            <VoiceRecorder
                isOpen={showVoiceRecorder}
                onClose={onCloseVoiceRecorder}
                onRecordingComplete={onVoiceRecordingComplete}
            />

            {parsedVoiceData && (
                <VoiceParsePreview
                    isOpen={!!parsedVoiceData}
                    onClose={onCloseVoicePreview}
                    parsedData={parsedVoiceData}
                    onConfirm={onVoiceParseConfirm}
                    isLoading={isParsingVoice}
                />
            )}
        </div>
    );
};
