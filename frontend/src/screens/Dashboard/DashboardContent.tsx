import { Skeleton } from '@/components/atoms'
import { EmptyState, TaskList } from '@/components/molecules'
import React, { memo } from 'react'
import DashboardKanbanView from './DashboardKanbanView'
import type { DashboardContentProps } from './types'

const DashboardContent = memo(({
    isLoading,
    tasks,
    viewMode,
    columns,
    sensors,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    activeTask,
    onEditTask,
    onDeleteTask,
    handleStatusChange,
    onOpenTaskForm,
    filters
}: DashboardContentProps) => {
    return (
        <>
            {isLoading && tasks?.length === 0 ? (
                <div className="space-y-4">
                    <Skeleton className="h-[200px] w-full rounded-xl" />
                    <Skeleton className="h-[200px] w-full rounded-xl" />
                </div>
            ) : tasks?.length === 0 ? (
                <EmptyState
                    title="No tasks found"
                    description={
                        Object.keys(filters).length > 0
                            ? "Try adjusting your filters or search query"
                            : "Get started by creating a new task or using voice input"
                    }
                    action={Object.keys(filters).length === 0 ? {
                        label: "Create Task",
                        onClick: onOpenTaskForm
                    } : undefined}
                />
            ) : (
                <React.Fragment>
                    {viewMode === 'kanban' ? (
                        <DashboardKanbanView
                            columns={columns}
                            sensors={sensors}
                            handleDragStart={handleDragStart}
                            handleDragEnd={handleDragEnd}
                            handleDragCancel={handleDragCancel}
                            activeTask={activeTask}
                            onEditTask={onEditTask}
                            onDeleteTask={onDeleteTask}
                            handleStatusChange={handleStatusChange}
                        />
                    ) : (
                        <TaskList
                            tasks={tasks}
                            onTaskClick={onEditTask}
                            onEditTask={onEditTask}
                            onDeleteTask={onDeleteTask}
                        />
                    )}
                </React.Fragment>
            )}
        </>
    )
})

export default DashboardContent