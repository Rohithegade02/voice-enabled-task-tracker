import { TaskStatus } from '@/types';

export const STATUS_COLORS: Record<TaskStatus, string> = {
    [TaskStatus.TODO]: 'border-t-secondary',
    [TaskStatus.IN_PROGRESS]: 'border-t-primary',
    [TaskStatus.DONE]: 'border-t-muted',
};

export const getColumnColor = (status: TaskStatus): string => {
    return STATUS_COLORS[status] ?? 'border-t-border';
};
