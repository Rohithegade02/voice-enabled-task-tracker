import React, { memo } from 'react';
import { TaskStatus, TaskPriority } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/atoms/dialog';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Textarea } from '@/components/atoms/textarea';
import { Label } from '@/components/atoms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/select';
import { useTaskForm } from './useTaskForm';
import type { TaskFormProps } from './types';
import { DatePicker } from '../DatePicker';

/**
 * TaskForm component for creating and editing tasks.
 * It shows a dialog with form fields for task details.
 *
 * @param {TaskFormProps} props - The props for the TaskForm component.
 * @param {boolean} props.isOpen - Whether the form is open or not.
 * @param {() => void} props.onClose - Callback function invoked when the form is closed.
 * @param {() => void} props.onSubmit - Callback function invoked when the form is submitted.
 * @param {CreateTaskDTO | UpdateTaskDTO} props.initialData - The initial data for the form.
 * @param {'create' | 'edit'} props.mode - The mode of the form (create or edit).
 */

export const TaskForm: React.FC<TaskFormProps> = memo(({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    mode,
}) => {
    // Business logic hook
    const {
        formData,
        errors,
        isSubmitting,
        handleFieldChange,
        handleSubmit,
    } = useTaskForm({
        isOpen,
        onClose,
        onSubmit,
        initialData,
        mode,
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{mode === 'create' ? 'Create New Task' : 'Edit Task'}</DialogTitle>
                    <DialogDescription>
                        {mode === 'create'
                            ? 'Fill in the details to create a new task.'
                            : 'Update the task details below.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">
                            Title <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => handleFieldChange('title', e.target.value)}
                            placeholder="Enter task title"
                            aria-invalid={!!errors.title}
                            disabled={isSubmitting}
                        />
                        {errors.title && (
                            <p className="text-sm text-destructive">{errors.title}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleFieldChange('description', e.target.value)}
                            placeholder="Enter task description (optional)"
                            rows={4}
                            aria-invalid={!!errors.description}
                            disabled={isSubmitting}
                        />
                        {errors.description && (
                            <p className="text-sm text-destructive">{errors.description}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => handleFieldChange('status', value as TaskStatus)}
                                disabled={isSubmitting}
                            >
                                <SelectTrigger className='w-full' id="status">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
                                    <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                                    <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={(value) => handleFieldChange('priority', value as TaskPriority)}
                                disabled={isSubmitting}
                            >
                                <SelectTrigger className='w-full' id="priority">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
                                    <SelectItem value={TaskPriority.MEDIUM}>Medium</SelectItem>
                                    <SelectItem value={TaskPriority.HIGH}>High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <DatePicker
                            label="Due Date"
                            date={formData.dueDate}
                            setDate={(date) => handleFieldChange('dueDate', date)}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Task' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
});
