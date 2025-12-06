import { useState, useCallback, useEffect } from 'react';
import type { CreateTaskDTO, UpdateTaskDTO, TaskStatus, TaskPriority, ParsedVoiceInput } from '@/types';

/**
 * Hook Props Interface
 */
interface UseVoiceParsePreviewProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: CreateTaskDTO | UpdateTaskDTO) => void;
    parsedData: ParsedVoiceInput | null;
    isLoading: boolean;
}

/**
 * Edited Task Data Interface
 */
interface EditedTaskData {
    title: string;
    description: string;
    priority: TaskPriority;
    dueDate: string;
    status: TaskStatus;
}

/**
 * Hook Return Interface
 */
interface UseVoiceParsePreviewReturn {
    editedData: EditedTaskData;
    errors: string[];
    handleFieldChange: (field: keyof EditedTaskData, value: string) => void;
    handleConfirm: () => void;
    validateFields: () => boolean;
}

/**
 * Default edited data
 */
const getDefaultEditedData = (): EditedTaskData => ({
    title: '',
    description: '',
    priority: 'Medium' as TaskPriority,
    dueDate: '',
    status: 'To Do' as TaskStatus,
});

/**
 * useVoiceParsePreview Hook
 * 
 * Business logic for VoiceParsePreview molecule component.
 * Handles parsed voice data editing, validation, and confirmation.
 * 
 * @param props - Hook configuration
 * @returns Edited data state and handlers
 * 
 * @example
 * const { editedData, errors, handleFieldChange, handleConfirm } = useVoiceParsePreview({
 *   isOpen,
 *   onClose,
 *   onConfirm,
 *   parsedData,
 *   isLoading
 * });
 */
export const useVoiceParsePreview = ({
    onConfirm,
    parsedData,
}: UseVoiceParsePreviewProps): UseVoiceParsePreviewReturn => {
    const [editedData, setEditedData] = useState<EditedTaskData>(getDefaultEditedData());
    const [errors, setErrors] = useState<string[]>([]);

    /**
     * Initialize edited data when parsedData changes
     */
    useEffect(() => {
        if (parsedData?.parsedTask) {
            setEditedData({
                title: parsedData.parsedTask.title || '',
                description: parsedData.parsedTask.description || '',
                priority: parsedData.parsedTask.priority || ('Medium' as TaskPriority),
                dueDate: parsedData.parsedTask.dueDate || '',
                status: parsedData.parsedTask.status || ('To Do' as TaskStatus),
            });
            setErrors([]);
        }
    }, [parsedData]);

    /**
     * Handle field value changes
     */
    const handleFieldChange = useCallback((field: keyof EditedTaskData, value: string) => {
        setEditedData((prev) => ({ ...prev, [field]: value }));
        // Clear errors when user makes changes
        setErrors([]);
    }, []);

    /**
     * Validate fields before confirmation
     */
    const validateFields = useCallback((): boolean => {
        const newErrors: string[] = [];

        if (!editedData.title.trim()) {
            newErrors.push('Title is required');
        }

        if (editedData.title.length > 200) {
            newErrors.push('Title must be less than 200 characters');
        }

        if (editedData.description.length > 1000) {
            newErrors.push('Description must be less than 1000 characters');
        }

        setErrors(newErrors);
        return newErrors.length === 0;
    }, [editedData]);

    /**
     * Handle confirmation
     */
    const handleConfirm = useCallback(() => {
        if (!validateFields()) {
            return;
        }

        const confirmData: CreateTaskDTO = {
            title: editedData.title.trim(),
            description: editedData.description.trim() || undefined,
            priority: editedData.priority,
            status: editedData.status,
            dueDate: editedData.dueDate ? new Date(editedData.dueDate) : undefined,
        };

        onConfirm(confirmData);
    }, [editedData, validateFields, onConfirm]);

    return {
        editedData,
        errors,
        handleFieldChange,
        handleConfirm,
        validateFields,
    };
};
