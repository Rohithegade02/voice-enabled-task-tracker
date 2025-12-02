import axios from 'axios';
import { API_BASE_URL } from '@/constants/api';

export const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

client.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.error?.message || error.message || 'Something went wrong';
        return Promise.reject(new Error(message));
    }
);
