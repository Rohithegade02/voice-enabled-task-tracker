import type { TaskStatus, TaskPriority, ParsedVoiceInput } from "@/types";

export interface VoiceParsePreviewProps {
    isOpen: boolean;
    onClose: () => void;
    parsedData: ParsedVoiceInput;
    onConfirm: (data: {
        title: string;
        description?: string;
        priority: TaskPriority;
        dueDate?: string;
        status: TaskStatus;
    }) => void;
    isLoading?: boolean;
}

export interface ParsedTaskFieldsProps {
    editedData: {
        title: string;
        description: string;
        priority: TaskPriority;
        dueDate: string;
        status: TaskStatus;
    };
    errors: Record<string, string>;
    onFieldChange: (field: string, value: string) => void;
}

export interface TranscriptDisplayProps {
    transcript: string;
}