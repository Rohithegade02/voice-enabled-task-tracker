import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import { API_BASE_URL } from '@/constants/api';
import {
    ApiError,
    NetworkError,
    ValidationError,
    AuthenticationError,
    NotFoundError,
    ServerError,
} from './errors';

// API Response wrapper type
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    count?: number;
    error?: {
        message: string;
        details?: unknown;
    };
}

// Create axios instance with default config
export const client: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 seconds
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Log request in development
        if (import.meta.env.DEV) {
            console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
                params: config.params,
                data: config.data,
            });
        }

        // Add timestamp to prevent caching
        if (config.method === 'get') {
            config.params = {
                ...config.params,
                _t: Date.now(),
            };
        }

        return config;
    },
    (error: AxiosError) => {
        console.error('[API Request Error]', error);
        return Promise.reject(new NetworkError('Failed to send request'));
    }
);

// Response interceptor
client.interceptors.response.use(
    (response: AxiosResponse) => {
        // Log response in development
        if (import.meta.env.DEV) {
            console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
                status: response.status,
                data: response.data,
            });
        }

        return response;
    },
    (error: AxiosError<ApiResponse<unknown>>) => {
        // Log error in development
        if (import.meta.env.DEV) {
            console.error('[API Error]', {
                url: error.config?.url,
                method: error.config?.method,
                status: error.response?.status,
                message: error.response?.data?.error?.message || error.message,
            });
        }

        // Handle network errors
        if (!error.response) {
            return Promise.reject(
                new NetworkError(
                    error.code === 'ECONNABORTED'
                        ? 'Request timeout - please try again'
                        : 'Network error - please check your connection'
                )
            );
        }

        const { status, data } = error.response;
        const errorMessage = data?.error?.message || error.message || 'An error occurred';
        const errorDetails = data?.error?.details;

        // Map HTTP status codes to custom errors
        switch (status) {
            case 400:
                return Promise.reject(new ValidationError(errorMessage, errorDetails));
            case 401:
                return Promise.reject(new AuthenticationError(errorMessage));
            case 404:
                return Promise.reject(new NotFoundError(errorMessage));
            case 500:
            case 502:
            case 503:
            case 504:
                return Promise.reject(new ServerError(errorMessage));
            default:
                return Promise.reject(new ApiError(errorMessage, status, 'UNKNOWN_ERROR', errorDetails));
        }
    }
);

// Helper to check if error is ApiError
export const isApiError = (error: unknown): error is ApiError => {
    return error instanceof ApiError;
};

// Helper to get error message
export const getErrorMessage = (error: unknown): string => {
    if (isApiError(error)) {
        return error.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return 'An unexpected error occurred';
};
