import React, { Activity, memo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/atoms/card';
import { Button } from '@/components/atoms/button';
import { Badge } from '@/components/atoms/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/atoms/dropdown-menu';
import { MoreVertical, Calendar, Trash2, Edit } from 'lucide-react';
import { PRIORITY_COLORS, STATUS_COLORS } from '@/constants';
import { format } from 'date-fns';
import type { TaskCardProps } from './types';

/**
 * TaskCard component for displaying a task card.
 * It shows a card with task details and optional action buttons.
 *
 * @param {TaskCardProps} props - The props for the TaskCard component.
 * @param {Task} props.task - The task to be displayed in the card.
 * @param {() => void} props.onEdit - Callback function invoked when the task is edited.
 * @param {() => void} props.onDelete - Callback function invoked when the task is deleted.
 * @param {() => void} props.onClick - Callback function invoked when the task card is clicked.
 */

export const TaskCard: React.FC<TaskCardProps> = memo(({
    task,
    onEdit,
    onDelete,
    onClick,
}) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.id,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
    };

    const handleCardClick = (e: React.MouseEvent) => {
        // Don't trigger onClick if clicking on buttons or dropdown
        if ((e.target as HTMLElement).closest('button')) {
            return;
        }
        onClick?.(task);
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow touch-none"
            onClick={handleCardClick}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-1">
                        <CardTitle className="text-base font-semibold line-clamp-2">
                            {task.title}
                        </CardTitle>
                        {task.description && (
                            <CardDescription className="line-clamp-2 text-sm">
                                {task.description}
                            </CardDescription>
                        )}
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm" onClick={(e) => e.stopPropagation()}>
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(task);
                                }}
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(task.id);
                                }}
                                className="text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            <CardContent className="pb-3">
                <div className="flex flex-wrap gap-2">
                    <Badge variant={PRIORITY_COLORS[task.priority]}>
                        {task.priority}
                    </Badge>
                    <Badge variant={STATUS_COLORS[task.status]}>
                        {task.status}
                    </Badge>
                </div>
            </CardContent>

            <Activity mode={task.dueDate ? 'visible' : 'hidden'}>
                <CardFooter className="pt-0">
                    <div className={`flex items-center gap-1 text-sm ${task.isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                            {task.dueDate && format(new Date(task.dueDate), 'MMM d, yyyy')}
                            {task.isOverdue && ' (Overdue)'}
                        </span>
                    </div>
                </CardFooter>
            </Activity>
        </Card>
    );
});
