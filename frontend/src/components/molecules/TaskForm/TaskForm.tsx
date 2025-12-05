import React, { useState, useEffect, memo } from 'react';
import { TaskStatus, TaskPriority, type CreateTaskDTO, type UpdateTaskDTO } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/atoms/dialog';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Textarea } from '@/components/atoms/textarea';
import { Label } from '@/components/atoms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/select';
import type { TaskFormProps } from './types';
import { DatePicker } from '../DatePicker';

export const TaskForm: React.FC<TaskFormProps> = memo(({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    mode,
}) => {
    console.log(mode)
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        status: initialData?.status || TaskStatus.TODO,
        priority: initialData?.priority || TaskPriority.MEDIUM,
        dueDate: initialData?.dueDate ? new Date(initialData.dueDate) : undefined
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Update form data when initialData changes (for edit mode)
    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                status: initialData.status || TaskStatus.TODO,
                priority: initialData.priority || TaskPriority.MEDIUM,
                dueDate: initialData.dueDate ? new Date(initialData.dueDate) : undefined
            });
        } else {
            // Reset form for create mode
            setFormData({
                title: '',
                description: '',
                status: TaskStatus.TODO,
                priority: TaskPriority.MEDIUM,
                dueDate: undefined
            });
        }
        setErrors({});
    }, [initialData, mode, isOpen]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.length > 200) {
            newErrors.title = 'Title must be less than 200 characters';
        }

        if (formData.description && formData.description.length > 1000) {
            newErrors.description = 'Description must be less than 1000 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        const submitData: CreateTaskDTO | UpdateTaskDTO = {
            title: formData.title.trim(),
            description: formData.description.trim() || undefined,
            status: formData.status,
            priority: formData.priority,
            dueDate: formData.dueDate || undefined,
        };

        onSubmit(submitData);
        handleClose();
    };

    const handleClose = () => {
        setFormData({
            title: '',
            description: '',
            status: TaskStatus.TODO,
            priority: TaskPriority.MEDIUM,
            dueDate: undefined,
        });
        setErrors({});
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
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
                            onChange={(e) => handleChange('title', e.target.value)}
                            placeholder="Enter task title"
                            aria-invalid={!!errors.title}
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
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Enter task description (optional)"
                            rows={4}
                            aria-invalid={!!errors.description}
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
                                onValueChange={(value) => handleChange('status', value)}
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
                                onValueChange={(value) => handleChange('priority', value)}
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
                            setDate={(date) => setFormData(prev => ({ ...prev, dueDate: date }))}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {mode === 'create' ? 'Create Task' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
});
