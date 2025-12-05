import React, { Activity } from 'react';
import type { Task, UpdateTaskDTO } from '@/types';
import { Button } from '@/components/atoms/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card';
import { Badge } from '@/components/atoms/badge';
import { ArrowLeft, Calendar, Clock, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { PRIORITY_COLORS, STATUS_COLORS } from '@/constants/colors';
import { TaskForm } from '@/components/molecules';

interface TaskDetailPresentationProps {
    task: Task;
    isLoading: boolean;
    error: string | null;
    isEditing: boolean;

    onBack: () => void;
    onEdit: () => void;
    onCancelEdit: () => void;
    onUpdate: (data: UpdateTaskDTO) => void;
    onDelete: () => void;
}

export const TaskDetailPresentation: React.FC<TaskDetailPresentationProps> = ({
    task,
    isLoading,
    error,
    isEditing,
    onBack,
    onEdit,
    onCancelEdit,
    onUpdate,
    onDelete,
}) => {
    if (isLoading) {
        return <div className="flex justify-center p-8">Loading...</div>;
    }

    if (error) {
        return <div className="text-destructive p-8">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto py-6 px-4 max-w-3xl">
            <Button variant="ghost" onClick={onBack} className="mb-6 gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
            </Button>

            <Card>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant={PRIORITY_COLORS[task.priority]}>
                                {task.priority} Priority
                            </Badge>
                            <Badge variant={STATUS_COLORS[task.status]}>
                                {task.status}
                            </Badge>
                        </div>
                        <CardTitle className="text-2xl font-bold">{task.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={onEdit}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={onDelete}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <Activity mode={task.description ? "visible" : "hidden"}>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                Description
                            </h3>
                            <p className="text-base leading-relaxed whitespace-pre-wrap">
                                {task.description}
                            </p>
                        </div>
                    </Activity>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                                <Calendar className="h-4 w-4" /> Due Date
                            </h3>
                            <p>
                                {task.dueDate
                                    ? format(new Date(task.dueDate), 'PPP p')
                                    : 'No due date set'
                                }
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                                <Clock className="h-4 w-4" /> Created At
                            </h3>
                            <p>{format(new Date(task.createdAt), 'PPP p')}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <TaskForm
                isOpen={isEditing}
                onClose={onCancelEdit}
                onSubmit={(data) => onUpdate(data as UpdateTaskDTO)}
                initialData={task}
                mode="edit"
            />
        </div>
    );
};
