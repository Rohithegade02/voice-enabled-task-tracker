import React, { memo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from '../TaskCard/TaskCard';
import { cn } from '@/lib/utils';
import type { KanbanColumnProps } from './types';
import { TaskStatus } from '@/types';
import { getColumnIndicatorColor } from '@/utils';

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
        <div className="flex flex-col h-full bg-gray-50 rounded-lg">
            <div className="p-3 bg-(--kanban-in-light) border-b">
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "w-2.5 h-2.5 rounded-full flex-shrink-0",
                        getColumnIndicatorColor(status)
                    )} />
                    <h3 className="font-semibold text-xs uppercase tracking-wide text-foreground/80">
                        {title}
                    </h3>
                    <span className="text-xs font-semibold text-muted-foreground bg-gray-200 px-2 py-0.5 rounded-full ml-auto">
                        {tasks?.length}
                    </span>
                </div>
            </div>

            <div
                ref={setNodeRef}
                className={cn(
                    "flex-1 p-3 space-y-3 overflow-y-auto transition-colors",
                    isOver && "bg-primary/5 ring-2 ring-primary/20 ring-inset"
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
