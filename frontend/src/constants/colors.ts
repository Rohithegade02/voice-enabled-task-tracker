import { TaskPriority, TaskStatus } from '@/types/task';

export const PRIORITY_COLORS = {
    [TaskPriority.HIGH]: 'destructive',
    [TaskPriority.MEDIUM]: 'default',
    [TaskPriority.LOW]: 'secondary',
} as const;

export const STATUS_COLORS = {
    [TaskStatus.TODO]: 'secondary',
    [TaskStatus.IN_PROGRESS]: 'default',
    [TaskStatus.DONE]: 'outline',
} as const;

export const PRIORITY_LABELS = {
    [TaskPriority.HIGH]: 'High',
    [TaskPriority.MEDIUM]: 'Medium',
    [TaskPriority.LOW]: 'Low',
} as const;

export const STATUS_LABELS = {
    [TaskStatus.TODO]: 'To Do',
    [TaskStatus.IN_PROGRESS]: 'In Progress',
    [TaskStatus.DONE]: 'Done',
} as const;
