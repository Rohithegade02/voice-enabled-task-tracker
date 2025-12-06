import { useState, useCallback, useEffect } from 'react';
import type { CreateTaskDTO, UpdateTaskDTO, Task, TaskStatus, TaskPriority } from '@/types';

/**
 * Hook Props Interface
 */
interface UseTaskFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateTaskDTO | UpdateTaskDTO) => void;
    initialData?: Task | null;
    mode: 'create' | 'edit';
}

/**
 * Form Data Interface
 */
interface FormData {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: Date;
}

/**
 * Hook Return Interface
 */
interface UseTaskFormReturn {
    formData: FormData;
    errors: Partial<Record<keyof FormData, string>>;
    isSubmitting: boolean;
    handleFieldChange: (field: keyof FormData, value: string | TaskStatus | TaskPriority | Date | undefined) => void;
    handleSubmit: (e: React.FormEvent) => void;
    resetForm: () => void;
}

/**
 * Default form values
 */
const getDefaultFormData = (): FormData => ({
    title: '',
    description: '',
    status: 'To Do' as TaskStatus,
    priority: 'Medium' as TaskPriority,
    dueDate: undefined,
});

/**
 * useTaskForm Hook
 * 
 * Business logic for TaskForm molecule component.
 * Handles form state, validation, and submission.
 * 
 * @param props - Hook configuration
 * @returns Form state and handlers
 * 
 * @example
 * const { formData, errors, handleFieldChange, handleSubmit } = useTaskForm({
 *   isOpen,
 *   onClose,
 *   onSubmit,
 *   initialData,
 *   mode: 'create'
 * });
 */
export const useTaskForm = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    mode,
}: UseTaskFormProps): UseTaskFormReturn => {
    const [formData, setFormData] = useState<FormData>(getDefaultFormData());
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * Initialize form data when modal opens or initialData changes
     */
    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && initialData) {
                setFormData({
                    title: initialData.title,
                    description: initialData.description || '',
                    status: initialData.status,
                    priority: initialData.priority,
                    dueDate: initialData.dueDate ? new Date(initialData.dueDate) : undefined,
                });
            } else {
                setFormData(getDefaultFormData());
            }
            setErrors({});
        }
    }, [isOpen, initialData, mode]);

    /**
     * Handle field value changes
     */
    const handleFieldChange = useCallback(
        (field: keyof FormData, value: string | TaskStatus | TaskPriority | Date | undefined) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
            // Clear error for this field when user starts typing
            if (errors[field]) {
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[field];
                    return newErrors;
                });
            }
        },
        [errors]
    );

    /**
     * Validate form data
     */
    const validateForm = useCallback((): boolean => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.length > 200) {
            newErrors.title = 'Title must be less than 200 characters';
        }

        if (formData.description.length > 1000) {
            newErrors.description = 'Description must be less than 1000 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    /**
     * Handle form submission
     */
    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();

            if (!validateForm()) {
                return;
            }

            setIsSubmitting(true);

            try {
                const submitData: CreateTaskDTO | UpdateTaskDTO = {
                    title: formData.title.trim(),
                    description: formData.description.trim() || undefined,
                    status: formData.status,
                    priority: formData.priority,
                    dueDate: formData.dueDate,
                };

                await onSubmit(submitData);
                resetForm();
                onClose();
            } catch (error) {
                // Error handling is done in the parent component
                console.error('Form submission error:', error);
            } finally {
                setIsSubmitting(false);
            }
        },
        [formData, validateForm, onSubmit, onClose]
    );

    /**
     * Reset form to default state
     */
    const resetForm = useCallback(() => {
        setFormData(getDefaultFormData());
        setErrors({});
        setIsSubmitting(false);
    }, []);

    return {
        formData,
        errors,
        isSubmitting,
        handleFieldChange,
        handleSubmit,
        resetForm,
    };
};
