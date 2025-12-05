import React, { Activity, memo } from 'react';
import { Input } from '@/components/atoms/input';
import { Textarea } from '@/components/atoms/textarea';
import { Label } from '@/components/atoms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/select';
import { TaskStatus, TaskPriority } from '@/types';
import type { ParsedTaskFieldsProps } from './types';

/**
 * ParsedTaskFields component for displaying parsed task fields.
 * It shows a form with task details and optional action buttons.
 *
 * @param {ParsedTaskFieldsProps} props - The props for the ParsedTaskFields component.
 * @param {ParsedTaskData} props.editedData - The parsed task data to be displayed.
 * @param {string[]} props.errors - The validation errors for each field.
 * @param {(field: string, value: string) => void} props.onFieldChange - Callback function invoked when a field value changes.
 */

export const ParsedTaskFields: React.FC<ParsedTaskFieldsProps> = memo(({
    editedData,
    errors,
    onFieldChange,
}) => {
    return (
        <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 text-sm font-medium">
                <span>Extracted Details</span>
            </div>

            {/* Title */}
            <div className="space-y-2">
                <Label htmlFor="title">
                    Title<span className="text-destructive">*</span>
                </Label>
                <Input
                    id="title"
                    value={editedData.title}
                    onChange={(e) => onFieldChange('title', e.target.value)}
                    placeholder="Enter task title"
                    aria-invalid={!!errors.title}
                />
                <Activity mode={errors.title ? "visible" : "hidden"}>
                    <p className="text-sm text-destructive">{errors.title}</p>
                </Activity>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={editedData.description}
                    onChange={(e) => onFieldChange('description', e.target.value)}
                    placeholder="Enter task description (optional)"
                    rows={3}
                    aria-invalid={!!errors.description}
                />
                <Activity mode={errors.description ? "visible" : "hidden"}>
                    <p className="text-sm text-destructive">{errors.description}</p>
                </Activity>
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                        value={editedData.status}
                        onValueChange={(value) => onFieldChange('status', value)}
                    >
                        <SelectTrigger className="w-full" id="status">
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
                        onValueChange={(value) => onFieldChange('priority', value)}
                    >
                        <SelectTrigger className="w-full" id="priority">
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

            {/* Due Date */}
            <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                    id="dueDate"
                    type="datetime-local"
                    value={editedData.dueDate}
                    onChange={(e) => onFieldChange('dueDate', e.target.value)}
                />
            </div>
        </div>
    );
});
