import React from 'react';
import type { Task } from '@/types/task';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/atoms/table';
import { Badge } from '@/components/atoms/badge';
import { Button } from '@/components/atoms/button';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/atoms/dropdown-menu';
import { PRIORITY_COLORS, STATUS_COLORS } from '@/constants/colors';
import { format } from 'date-fns';
import type { TaskListItemProps } from './types';



export const TaskListItem: React.FC<TaskListItemProps> = ({
    task,
    onClick,
    onEdit,
    onDelete,
}) => {
    return (
        <TableRow
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => onClick(task)}
        >
            <TableCell className="font-medium max-w-xs">
                <div className="truncate">{task.title}</div>
                {task.description && (
                    <div className="text-sm text-muted-foreground truncate">
                        {task.description}
                    </div>
                )}
            </TableCell>
            <TableCell>
                <Badge variant={STATUS_COLORS[task.status]}>
                    {task.status}
                </Badge>
            </TableCell>
            <TableCell>
                <Badge variant={PRIORITY_COLORS[task.priority]}>
                    {task.priority}
                </Badge>
            </TableCell>
            <TableCell>
                {task.dueDate ? (
                    <span className={task.isOverdue ? 'text-destructive' : ''}>
                        {format(new Date(task.dueDate), 'MMM d, yyyy')}
                    </span>
                ) : (
                    <span className="text-muted-foreground">-</span>
                )}
            </TableCell>
            <TableCell onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(task)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete(task.id)}
                            className="text-destructive"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
};

interface TaskListProps {
    tasks: Task[];
    onTaskClick: (task: Task) => void;
    onEditTask: (task: Task) => void;
    onDeleteTask: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
    tasks,
    onTaskClick,
    onEditTask,
    onDeleteTask,
}) => {
    if (tasks.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
                No tasks found
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tasks.map((task) => (
                        <TaskListItem
                            key={task.id}
                            task={task}
                            onClick={onTaskClick}
                            onEdit={onEditTask}
                            onDelete={onDeleteTask}
                        />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
