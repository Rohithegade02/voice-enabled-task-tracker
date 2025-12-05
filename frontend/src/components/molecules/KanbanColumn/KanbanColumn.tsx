import React, { memo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from '../TaskCard/TaskCard';
import { cn } from '@/lib/utils';
import type { KanbanColumnProps } from './types';
import { getColumnColor } from '@/utils';

/**
 * KanbanColumn component for displaying a column in the Kanban board.
 * It shows a column with a header, a droppable zone for tasks, and optional action buttons.
 *
 * @param {KanbanColumnProps} props - The props for the KanbanColumn component.
 * @param {string} props.title - The title displayed in the column header.
 * @param {string} props.status - The status of the column (e.g., "todo", "in_progress", "done").
 * @param {Task[]} props.tasks - The tasks to be displayed in the column.
 * @param {() => void} props.onTaskClick - Callback function invoked when a task is clicked.
 * @param {() => void} props.onEditTask - Callback function invoked when a task is edited.
 * @param {() => void} props.onDeleteTask - Callback function invoked when a task is deleted.
 * @param {() => void} props.onStatusChange - Callback function invoked when the status of a task changes.
 */

export const KanbanColumn: React.FC<KanbanColumnProps> = memo(({
    title,
    status,
    tasks,
    onTaskClick,
    onEditTask,
    onDeleteTask,
    onStatusChange,
}) => {
    const { setNodeRef, isOver } = useDroppable({
        id: status,
    });

    return (
        <div className="flex flex-col h-full">
            <div className={cn(
                "border-t-4 border-gray-300 rounded-t-lg bg-card p-4 border-b",
                getColumnColor(status)
            )}>
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm uppercase tracking-wide">
                        {title}
                    </h3>
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        {tasks?.length}
                    </span>
                </div>
            </div>

            <div
                ref={setNodeRef}
                className={cn(
                    "flex-1 p-4 space-y-3 overflow-y-auto bg-muted/20 rounded-b-lg transition-colors",
                    isOver && "bg-primary/10 ring-2 ring-primary/50"
                )}
            >
                {tasks?.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                        {isOver ? "Drop here" : "No tasks"}
                    </div>
                ) : (
                    tasks?.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onClick={onTaskClick}
                            onEdit={onEditTask}
                            onDelete={onDeleteTask}
                            onStatusChange={onStatusChange}
                        />
                    ))
                )}
            </div>
        </div>
    );
});
