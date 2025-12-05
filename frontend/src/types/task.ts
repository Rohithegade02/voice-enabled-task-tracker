export enum TaskStatus {
    TODO = 'To Do',
    IN_PROGRESS = 'In Progress',
    DONE = 'Done',
}

export enum TaskPriority {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High',
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
    isOverdue?: boolean;
}

export interface CreateTaskDTO {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: Date;
}

export interface UpdateTaskDTO {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string;
}

export interface TaskFilters {
    status?: TaskStatus;
    priority?: TaskPriority;
    search?: string;
    dueDateFrom?: string;
    dueDateTo?: string;
}

export interface ParsedVoiceInput {
    transcript: string;
    parsedTask: {
        title?: string;
        description?: string;
        priority?: TaskPriority;
        dueDate?: string;
        status?: TaskStatus;
    };
}
