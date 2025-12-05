import React, { memo, useCallback, useState } from 'react';
import { TaskStatus, TaskPriority } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/atoms/dialog';
import { Button } from '@/components/atoms/button';
import type { VoiceParsePreviewProps } from './types';
import { TranscriptDisplay } from './TranscriptDisplay';
import { ParsedTaskFields } from './ParsedTaskFields';

export const VoiceParsePreview: React.FC<VoiceParsePreviewProps> = memo(({
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

    const handleFieldChange = useCallback((field: string, value: string) => {
        setEditedData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    }, [errors]);

    const validate = useCallback(() => {
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
    }, [editedData]);

    const handleConfirm = useCallback(() => {
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
    }, [editedData, validate]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Parsed Task</DialogTitle>
                    <DialogDescription>
                        Review and edit the task details extracted from your voice input
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <TranscriptDisplay transcript={parsedData.transcript} />

                    <ParsedTaskFields
                        editedData={editedData}
                        errors={errors}
                        onFieldChange={handleFieldChange}
                    />
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
});
