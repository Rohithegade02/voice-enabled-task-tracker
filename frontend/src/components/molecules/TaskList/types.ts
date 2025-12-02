import type { Task } from "@/types/task";

export interface TaskListItemProps {
    task: Task;
    onClick: (task: Task) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}