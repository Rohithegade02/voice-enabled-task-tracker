import type { Task, TaskStatus } from "@/types";

export interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    onStatusChange: (id: string, status: TaskStatus) => void;
    onClick?: (task: Task) => void;
}

export interface UseTaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    onClick?: (task: Task) => void;
}
export interface UseTaskCardReturn {
    handleEdit: () => void;
    handleDelete: () => void;
    handleCardClick: (e: React.MouseEvent) => void;
}