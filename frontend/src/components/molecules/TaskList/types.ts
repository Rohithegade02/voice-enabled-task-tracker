import type { Task } from "@/types";

export interface TaskListItemProps {
    task: Task;
    onClick: (task: Task) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

export interface TaskListProps {
    tasks: Task[];
    onTaskClick: (task: Task) => void;
    onEditTask: (task: Task) => void;
    onDeleteTask: (id: string) => void;
}