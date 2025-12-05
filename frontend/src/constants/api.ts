export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
    TASKS: '/tasks',
    TASK_BY_ID: (id: string) => `/tasks/${id}`,
    PARSE_VOICE: '/tasks/parse-voice',
    PARSE_TEXT: '/tasks/parse-text',
    HEALTH: '/health',
} as const;

// API Configuration
export const API_CONFIG = {
    TIMEOUT: 30000, // 30 seconds
    VOICE_TIMEOUT: 60000, // 60 seconds for voice processing
    MAX_AUDIO_SIZE: 10 * 1024 * 1024, // 10MB
    SUPPORTED_AUDIO_TYPES: ['audio/webm', 'audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg'],
} as const;
