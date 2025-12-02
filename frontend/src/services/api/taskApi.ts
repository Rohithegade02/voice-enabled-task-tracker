import { client } from './client';
import { API_ENDPOINTS } from '@/constants/api';
import type {
    Task,
    CreateTaskDTO,
    UpdateTaskDTO,
    TaskFilters,
    ParsedVoiceInput
} from '@/types/task';

export const taskApi = {
    getTasks: async (filters?: TaskFilters): Promise<Task[]> => {
        const params = new URLSearchParams();
        if (filters) {
            if (filters.status) params.append('status', filters.status);
            if (filters.priority) params.append('priority', filters.priority);
            if (filters.search) params.append('search', filters.search);
            if (filters.dueDateFrom) params.append('dueDateFrom', filters.dueDateFrom);
            if (filters.dueDateTo) params.append('dueDateTo', filters.dueDateTo);
        }
        const response = await client.get<{ data: Task[] }>(`${API_ENDPOINTS.TASKS}?${params.toString()}`);
        return response.data.data;
    },

    getTaskById: async (id: string): Promise<Task> => {
        const response = await client.get<{ data: Task }>(API_ENDPOINTS.TASK_BY_ID(id));
        return response.data.data;
    },

    createTask: async (data: CreateTaskDTO): Promise<Task> => {
        const response = await client.post<{ data: Task }>(API_ENDPOINTS.TASKS, data);
        return response.data.data;
    },

    updateTask: async (id: string, data: UpdateTaskDTO): Promise<Task> => {
        const response = await client.put<{ data: Task }>(API_ENDPOINTS.TASK_BY_ID(id), data);
        return response.data.data;
    },

    deleteTask: async (id: string): Promise<void> => {
        await client.delete(API_ENDPOINTS.TASK_BY_ID(id));
    },

    parseVoiceInput: async (audioFile: Blob): Promise<ParsedVoiceInput> => {
        const formData = new FormData();
        formData.append('audio', audioFile);

        const response = await client.post<{ data: ParsedVoiceInput }>(
            API_ENDPOINTS.PARSE_VOICE,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data.data;
    },

    parseTextInput: async (transcript: string): Promise<ParsedVoiceInput> => {
        const response = await client.post<{ data: ParsedVoiceInput }>(
            API_ENDPOINTS.PARSE_TEXT,
            { transcript }
        );
        return response.data.data;
    }
};
