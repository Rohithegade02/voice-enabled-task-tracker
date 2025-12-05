import { useState, useCallback } from 'react';
import type { ParsedVoiceInput } from '@/types';
import { taskApi, getErrorMessage } from '@/services/api';

interface UseVoiceParsingReturn {
    parseVoice: (audioBlob: Blob) => Promise<ParsedVoiceInput>;
    parsedData: ParsedVoiceInput | null;
    isLoading: boolean;
    error: string | null;
    resetParsing: () => void;
    clearError: () => void;
}

/**
 * Custom hook for handling voice input parsing
 * Manages voice-to-task conversion with loading and error states
 */
export const useVoiceParsing = (): UseVoiceParsingReturn => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [parsedData, setParsedData] = useState<ParsedVoiceInput | null>(null);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const parseVoice = useCallback(async (audioBlob: Blob): Promise<ParsedVoiceInput> => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await taskApi.parseVoiceInput(audioBlob);
            setParsedData(result);
            return result;
        } catch (err) {
            const message = getErrorMessage(err);
            setError(message);
            console.error('[useVoiceParsing] Parse error:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const resetParsing = useCallback(() => {
        setParsedData(null);
        setError(null);
        setIsLoading(false);
    }, []);

    return {
        parseVoice,
        parsedData,
        isLoading,
        error,
        resetParsing,
        clearError,
    };
};
