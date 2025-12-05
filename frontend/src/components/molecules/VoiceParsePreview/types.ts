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