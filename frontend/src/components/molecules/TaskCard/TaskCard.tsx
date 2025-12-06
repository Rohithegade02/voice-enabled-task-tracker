import React, { memo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card';
import { Button } from '@/components/atoms/button';
import { Badge } from '@/components/atoms/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/atoms/dropdown-menu';
import { MoreVertical, Calendar, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import type { TaskCardProps } from './types';
import { TaskPriority } from '@/types';
import { cn } from '@/lib/utils';
import { getColumnIndicatorColor, getPriorityStyle } from '@/utils';

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
            className="cursor-grab active:cursor-grabbing hover:shadow-lg transition-all touch-none border border-border/50"
            onClick={handleCardClick}
        >
            <CardHeader className="pb-2 pt-3 px-2">
                <div className="flex items-start justify-between gap-2 mb-2">

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center justify-between w-full">
                                <div className={`${getColumnIndicatorColor(task.status)} text-white px-2 py-1 rounded text-xs`}>
                                    {task.status}
                                </div>
                                <Button variant="ghost" size="icon-sm" className="h-6 w-6 -mt-1" onClick={(e) => e.stopPropagation()}>
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </div>
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

                <CardTitle className="text-sm font-semibold line-clamp-1 leading-tight">
                    {task.title}
                </CardTitle>
                {task.description && (
                    <CardDescription className="line-clamp-2 text-xs mt-1 leading-snug">
                        {task.description}
                    </CardDescription>
                )}
            </CardHeader>

            <CardContent className="pb-2 flex justify-between items-center px-2 space-y-2">
                {task.dueDate && (
                    <div className={cn(
                        "flex items-center mt-2 gap-1 text-[11px]",
                        task.isOverdue ? 'text-destructive' : 'text-muted-foreground'
                    )}>
                        <Calendar className="h-3 w-3" />
                        <span>
                            {format(new Date(task.dueDate), 'dd MMM yyyy')}
                        </span>
                    </div>
                )}
                <div>
                    <Badge
                        variant="outline"
                        className={cn(
                            "text-[10px] font-semibold px-2 py-0.5 border-0 rounded",
                            getPriorityStyle(task.priority)
                        )}
                    >
                        {task.priority}
                    </Badge>
                </div>
            </CardContent>

        </Card>
    );
});
