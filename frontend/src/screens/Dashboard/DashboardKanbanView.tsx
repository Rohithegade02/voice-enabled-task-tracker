import { KanbanColumn, TaskCard } from '@/components/molecules';
import { DragOverlay, DndContext } from '@dnd-kit/core';
import type { DashboardKanbanViewProps } from './types';
import { memo } from 'react';

const DashboardKanbanView = memo(({
    columns,
    sensors,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    activeTask,
    onEditTask,
    onDeleteTask,
    handleStatusChange
}: DashboardKanbanViewProps) => {
    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-250px)] border-gray-200 min-h-[500px]">
                {
                    columns.map((column) => (
                        <KanbanColumn
                            key={column.status}
                            title={column.title}
                            status={column.status}
                            tasks={column.tasks}
                            onTaskClick={onEditTask}
                            onEditTask={onEditTask}
                            onDeleteTask={onDeleteTask}
                            onStatusChange={handleStatusChange}
                        />
                    ))
                }
            </div>

            {/* Drag Overlay */}
            <DragOverlay>
                {activeTask ? (
                    <div className="opacity-80 rotate-3 cursor-grabbing">
                        <TaskCard
                            task={activeTask}
                            onClick={() => { }}
                            onEdit={() => { }}
                            onDelete={() => { }}
                            onStatusChange={() => { }}
                        />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    )
})

export default DashboardKanbanView