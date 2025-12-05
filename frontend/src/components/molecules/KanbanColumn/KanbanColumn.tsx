import React, { memo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from '../TaskCard/TaskCard';
import { cn } from '@/lib/utils';
import type { KanbanColumnProps } from './types';
import { getColumnColor } from '@/utils';

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
            {/* Column Header */}
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

            {/* Tasks Container - Droppable Zone */}
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
