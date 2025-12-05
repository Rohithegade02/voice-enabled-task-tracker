import type { CreateTaskDTO, ParsedVoiceInput, Task, TaskFilters, TaskStatus, UpdateTaskDTO } from "@/types";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";

export interface DashboardPresentationProps {
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

export interface DashboardKanbanViewProps {
    columns: {
        title: string;
        status: TaskStatus;
        tasks: Task[];
    }[];
    sensors: any;
    handleDragStart: (event: DragStartEvent) => void;
    handleDragEnd: (event: DragEndEvent) => void;
    handleDragCancel: () => void;
    activeTask: Task | null;
    onEditTask: (task: Task) => void;
    onDeleteTask: (id: string) => void;
    handleStatusChange: (id: string, status: TaskStatus) => void;
}

export interface DashboardHeaderProps {
    onOpenVoiceRecorder: () => void;
    onOpenTaskForm: () => void;
}

export interface DashboardFilterBarProps {
    filters: TaskFilters;
    onFilterChange: (filters: TaskFilters) => void;
    onClearFilters: () => void;
    viewMode: 'kanban' | 'list';
    onViewModeChange: (mode: 'kanban' | 'list') => void;
}
export interface DashboardContentProps {
    isLoading: boolean;
    tasks: Task[];
    viewMode: 'kanban' | 'list';
    columns: {
        title: string;
        status: TaskStatus;
        tasks: Task[];
    }[];
    sensors: any;
    handleDragStart: (event: DragStartEvent) => void;
    handleDragEnd: (event: DragEndEvent) => void;
    handleDragCancel: () => void;
    activeTask: Task | null;
    onEditTask: (task: Task) => void;
    onDeleteTask: (id: string) => void;
    handleStatusChange: (id: string, status: TaskStatus) => void;
    onOpenTaskForm: () => void;
    filters: TaskFilters;
}
export interface DashboardModalProps {
    showTaskForm: boolean;
    onCloseTaskForm: () => void;
    handleTaskSubmit: (data: CreateTaskDTO | UpdateTaskDTO) => void;
    editingTask: Task | null;
    showVoiceRecorder: boolean;
    onCloseVoiceRecorder: () => void;
    onVoiceRecordingComplete: (audioBlob: Blob) => void;
    parsedVoiceData: ParsedVoiceInput | null;
    onCloseVoicePreview: () => void;
    onVoiceParseConfirm: (data: CreateTaskDTO | UpdateTaskDTO) => void;
    isParsingVoice: boolean;
}