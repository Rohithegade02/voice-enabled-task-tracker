import { TaskStatus, TaskPriority } from '@/types';

// Priority color mappings for badges
export const PRIORITY_COLORS: Record<TaskPriority, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    [TaskPriority.HIGH]: 'destructive',
    [TaskPriority.MEDIUM]: 'default',
    [TaskPriority.LOW]: 'secondary',
} as const;

// Status color mappings for badges
export const STATUS_COLORS: Record<TaskStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    [TaskStatus.TODO]: 'outline',
    [TaskStatus.IN_PROGRESS]: 'default',
    [TaskStatus.DONE]: 'secondary',
} as const;

// Priority labels
export const PRIORITY_LABELS: Record<TaskPriority, string> = {
    [TaskPriority.HIGH]: 'High',
    [TaskPriority.MEDIUM]: 'Medium',
    [TaskPriority.LOW]: 'Low',
} as const;

// Status labels
export const STATUS_LABELS: Record<TaskStatus, string> = {
    [TaskStatus.TODO]: 'To Do',
    [TaskStatus.IN_PROGRESS]: 'In Progress',
    [TaskStatus.DONE]: 'Done',
} as const;
