import React, { Activity, memo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/atoms/table';
import { Badge } from '@/components/atoms/badge';
import { Button } from '@/components/atoms/button';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/atoms/dropdown-menu';
import { PRIORITY_COLORS, STATUS_COLORS } from '@/constants';
import { format } from 'date-fns';
import type { TaskListItemProps, TaskListProps } from './types';
import { getPriorityStyle } from '@/utils';
import { cn } from '@/lib/utils';

/**
 * TaskListItem component for displaying a task list item.
 * It shows a list item with task details and optional action buttons.
 *
 * @param {TaskListItemProps} props - The props for the TaskListItem component.
 * @param {Task} props.task - The task to be displayed in the list item.
 * @param {() => void} props.onClick - Callback function invoked when the task list item is clicked.
 * @param {() => void} props.onEdit - Callback function invoked when the task is edited.
 * @param {() => void} props.onDelete - Callback function invoked when the task is deleted.
 */

export const TaskListItem: React.FC<TaskListItemProps> = memo(({
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
                <Activity mode={task.description ? "visible" : "hidden"}>
                    <div className="text-sm text-muted-foreground truncate">
                        {task.description}
                    </div>
                </Activity>
            </TableCell>
            <TableCell>
                <Badge variant={STATUS_COLORS[task.status]}>
                    {task.status}
                </Badge>
            </TableCell>
            <TableCell>
                <Badge
                    variant="outline"
                    className={cn(
                        "text-xs font-semibold px-2 py-0.5 border-0 rounded-full",
                        getPriorityStyle(task.priority)
                    )}
                >
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
});


export const TaskList: React.FC<TaskListProps> = memo(({
    tasks,
    onTaskClick,
    onEditTask,
    onDeleteTask,
}) => {
    if (tasks?.length === 0) {
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
});
