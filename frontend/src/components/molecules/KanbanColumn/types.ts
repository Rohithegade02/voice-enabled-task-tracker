import type { Task, TaskStatus } from "@/types/task";

export interface KanbanColumnProps {
    title: string;
    status: TaskStatus;
    tasks: Task[];
    onTaskClick: (task: Task) => void;
    onEditTask: (task: Task) => void;
    onDeleteTask: (id: string) => void;
    onStatusChange: (id: string, status: TaskStatus) => void;
}