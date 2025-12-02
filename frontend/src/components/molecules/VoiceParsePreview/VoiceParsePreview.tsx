import React, { useState } from 'react';
import { TaskStatus, TaskPriority } from '@/types/task';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/atoms/dialog';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Textarea } from '@/components/atoms/textarea';
import { Label } from '@/components/atoms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card';
import { MessageSquare, Edit2 } from 'lucide-react';
import type { VoiceParsePreviewProps } from './types';


export const VoiceParsePreview: React.FC<VoiceParsePreviewProps> = ({
    isOpen,
    onClose,
    parsedData,
    onConfirm,
    isLoading = false,
}) => {
    const [editedData, setEditedData] = useState({
        title: parsedData.parsedTask.title || '',
        description: parsedData.parsedTask.description || '',
        priority: parsedData.parsedTask.priority || TaskPriority.MEDIUM,
        dueDate: parsedData.parsedTask.dueDate
            ? new Date(parsedData.parsedTask.dueDate).toISOString().slice(0, 16)
            : '',
        status: parsedData.parsedTask.status || TaskStatus.TODO,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: string, value: string) => {
        setEditedData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!editedData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (editedData.title.length > 200) {
            newErrors.title = 'Title must be less than 200 characters';
        }

        if (editedData.description && editedData.description.length > 1000) {
            newErrors.description = 'Description must be less than 1000 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleConfirm = () => {
        if (!validate()) {
            return;
        }

        onConfirm({
            title: editedData.title.trim(),
            description: editedData.description.trim() || undefined,
            priority: editedData.priority,
            dueDate: editedData.dueDate || undefined,
            status: editedData.status,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Review Parsed Task</DialogTitle>
                    <DialogDescription>
                        Review and edit the task details extracted from your voice input
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Transcript Display */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Voice Transcript
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground italic">
                                "{parsedData.transcript}"
                            </p>
                        </CardContent>
                    </Card>

                    {/* Editable Fields */}
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Edit2 className="h-4 w-4" />
                            <span>Extracted Details (Editable)</span>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">
                                Title <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="title"
                                value={editedData.title}
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
                                value={editedData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="Enter task description (optional)"
                                rows={3}
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
                                    value={editedData.status}
                                    onValueChange={(value) => handleChange('status', value)}
                                >
                                    <SelectTrigger id="status">
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
                                    value={editedData.priority}
                                    onValueChange={(value) => handleChange('priority', value)}
                                >
                                    <SelectTrigger id="priority">
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
                            <Label htmlFor="dueDate">Due Date</Label>
                            <Input
                                id="dueDate"
                                type="datetime-local"
                                value={editedData.dueDate}
                                onChange={(e) => handleChange('dueDate', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <span className="mr-2">Creating...</span>
                                <span className="animate-spin">⏳</span>
                            </>
                        ) : (
                            'Create Task'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
