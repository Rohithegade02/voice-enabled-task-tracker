import { client, type ApiResponse } from './client';
import { API_ENDPOINTS } from '@/constants/api';
import type {
    Task,
    CreateTaskDTO,
    UpdateTaskDTO,
    TaskFilters,
    ParsedVoiceInput,
} from '@/types';
import { ValidationError } from './errors';

/**
 * Task API Service
 * Handles all task-related API operations with proper error handling and validation
 */
export const taskApi = {
    /**
     * Fetch all tasks with optional filters
     * @param filters - Optional filters for status, priority, search, and date range
     * @returns Promise<Task[]>
     */
    getTasks: async (filters?: TaskFilters): Promise<Task[]> => {
        const params = new URLSearchParams();

        if (filters) {
            if (filters.status) params.append('status', filters.status);
            if (filters.priority) params.append('priority', filters.priority);
            if (filters.search) params.append('search', filters.search.trim());
            if (filters.dueDateFrom) params.append('dueDateFrom', filters.dueDateFrom);
            if (filters.dueDateTo) params.append('dueDateTo', filters.dueDateTo);
        }

        const queryString = params.toString();
        const url = queryString ? `${API_ENDPOINTS.TASKS}?${queryString}` : API_ENDPOINTS.TASKS;

        const response = await client.get<ApiResponse<Task[]>>(url);
        return response.data.data;
    },

    /**
     * Fetch a single task by ID
     * @param id - Task ID
     * @returns Promise<Task>
     * @throws NotFoundError if task doesn't exist
     */
    getTaskById: async (id: string): Promise<Task> => {
        if (!id || id.trim().length === 0) {
            throw new ValidationError('Task ID is required');
        }

        const response = await client.get<ApiResponse<Task>>(API_ENDPOINTS.TASK_BY_ID(id));
        return response.data.data;
    },

    /**
     * Create a new task
     * @param data - Task creation data
     * @returns Promise<Task>
     * @throws ValidationError if data is invalid
     */
    createTask: async (data: CreateTaskDTO): Promise<Task> => {
        // Client-side validation
        if (!data.title || data.title.trim().length === 0) {
            throw new ValidationError('Task title is required');
        }

        if (data.title.length > 200) {
            throw new ValidationError('Task title must be less than 200 characters');
        }

        if (data.description && data.description.length > 1000) {
            throw new ValidationError('Task description must be less than 1000 characters');
        }

        const response = await client.post<ApiResponse<Task>>(API_ENDPOINTS.TASKS, data);
        return response.data.data;
    },

    /**
     * Update an existing task
     * @param id - Task ID
     * @param data - Task update data
     * @returns Promise<Task>
     * @throws NotFoundError if task doesn't exist
     * @throws ValidationError if data is invalid
     */
    updateTask: async (id: string, data: UpdateTaskDTO): Promise<Task> => {
        if (!id || id.trim().length === 0) {
            throw new ValidationError('Task ID is required');
        }

        // Client-side validation
        if (data.title !== undefined && data.title.trim().length === 0) {
            throw new ValidationError('Task title cannot be empty');
        }

        if (data.title && data.title.length > 200) {
            throw new ValidationError('Task title must be less than 200 characters');
        }

        if (data.description && data.description.length > 1000) {
            throw new ValidationError('Task description must be less than 1000 characters');
        }

        const response = await client.put<ApiResponse<Task>>(API_ENDPOINTS.TASK_BY_ID(id), data);
        return response.data.data;
    },

    /**
     * Delete a task
     * @param id - Task ID
     * @returns Promise<void>
     * @throws NotFoundError if task doesn't exist
     */
    deleteTask: async (id: string): Promise<void> => {
        if (!id || id.trim().length === 0) {
            throw new ValidationError('Task ID is required');
        }

        await client.delete(API_ENDPOINTS.TASK_BY_ID(id));
    },

    /**
     * Parse voice input to extract task details
     * @param audioFile - Audio blob from recording
     * @returns Promise<ParsedVoiceInput>
     * @throws ValidationError if audio file is invalid
     */
    parseVoiceInput: async (audioFile: Blob): Promise<ParsedVoiceInput> => {
        // Validate audio file
        if (!audioFile || audioFile.size === 0) {
            throw new ValidationError('Audio file is required');
        }

        // Check file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (audioFile.size > maxSize) {
            throw new ValidationError('Audio file size must be less than 10MB');
        }

        // Check file type
        const validTypes = ['audio/webm', 'audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg'];
        if (!validTypes.includes(audioFile.type)) {
            throw new ValidationError(
                `Invalid audio format. Supported formats: ${validTypes.join(', ')}`
            );
        }

        const formData = new FormData();
        formData.append('audio', audioFile, 'recording.webm');

        const response = await client.post<ApiResponse<ParsedVoiceInput>>(
            API_ENDPOINTS.PARSE_VOICE,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 60000, // 60 seconds for voice processing
            }
        );

        return response.data.data;
    },

    /**
     * Parse text transcript to extract task details
     * @param transcript - Text transcript
     * @returns Promise<ParsedVoiceInput>
     * @throws ValidationError if transcript is invalid
     */
    parseTextInput: async (transcript: string): Promise<ParsedVoiceInput> => {
        if (!transcript || transcript.trim().length === 0) {
            throw new ValidationError('Transcript is required');
        }

        if (transcript.length > 5000) {
            throw new ValidationError('Transcript must be less than 5000 characters');
        }

        const response = await client.post<ApiResponse<ParsedVoiceInput>>(
            API_ENDPOINTS.PARSE_TEXT,
            { transcript: transcript.trim() }
        );

        return response.data.data;
    },
} as const;

// Export type for the API
export type TaskApiType = typeof taskApi;
