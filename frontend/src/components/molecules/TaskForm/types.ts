import type { CreateTaskDTO, Task, UpdateTaskDTO } from "@/types";

export interface TaskFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateTaskDTO | UpdateTaskDTO) => void;
    initialData?: Task;
    mode: 'create' | 'edit';
}
