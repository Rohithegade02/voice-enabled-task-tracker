import { useState, useCallback } from 'react';
import type { ParsedVoiceInput } from '@/types/task';
import { taskApi } from '@/services/api/taskApi';

export const useVoiceParsing = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [parsedData, setParsedData] = useState<ParsedVoiceInput | null>(null);

    const parseVoice = useCallback(async (audioBlob: Blob) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await taskApi.parseVoiceInput(audioBlob);
            setParsedData(result);
            return result;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to parse voice input';
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const resetParsing = useCallback(() => {
        setParsedData(null);
        setError(null);
    }, []);

    return {
        parseVoice,
        parsedData,
        isLoading,
        error,
        resetParsing,
    };
};
