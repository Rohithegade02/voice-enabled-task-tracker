import { TaskPriority, TaskStatus } from '@/types';

export const STATUS_COLORS: Record<TaskStatus, string> = {
    [TaskStatus.TODO]: 'border-t-secondary',
    [TaskStatus.IN_PROGRESS]: 'border-t-primary',
    [TaskStatus.DONE]: 'border-t-muted',
};

export const getColumnColor = (status: TaskStatus): string => {
    return STATUS_COLORS[status] ?? 'border-t-border';
};


export const getPriorityStyle = (priority: TaskPriority) => {
    switch (priority) {
        case TaskPriority.LOW:
            return 'text-[var(--priority-low)] bg-[var(--priority-low-bg)]';
        case TaskPriority.MEDIUM:
            return 'text-[var(--priority-medium)] bg-[var(--priority-medium-bg)]';
        case TaskPriority.HIGH:
            return 'text-[var(--priority-high)] bg-[var(--priority-high-bg)]';
        default:
            return 'text-gray-600 bg-gray-100';
    }
};

export const getColumnIndicatorColor = (status: TaskStatus): string => {
    switch (status) {
        case TaskStatus.TODO:
            return 'bg-[var(--kanban-todo)]';
        case TaskStatus.IN_PROGRESS:
            return 'bg-[var(--kanban-in-progress)]';
        case TaskStatus.DONE:
            return 'bg-[var(--kanban-done)]';
        default:
            return 'bg-gray-400';
    }
};