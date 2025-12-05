import type { Task, TaskStatus } from "@/types";

export interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    onStatusChange: (id: string, status: TaskStatus) => void;
    onClick?: (task: Task) => void;
}