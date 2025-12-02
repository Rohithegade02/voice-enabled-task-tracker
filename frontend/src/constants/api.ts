export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
    TASKS: '/tasks',
    TASK_BY_ID: (id: string) => `/tasks/${id}`,
    PARSE_VOICE: '/tasks/parse-voice',
    PARSE_TEXT: '/tasks/parse-text',
    HEALTH: '/health',
} as const;
