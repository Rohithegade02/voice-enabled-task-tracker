import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { taskApi } from '@/services/api';
import type { ParsedVoiceInput } from '@/types';


interface VoiceState {
    parsedData: ParsedVoiceInput | null;
    isLoading: boolean;
    error: string | null;
    parseVoice: (audioBlob: Blob) => Promise<void>;
    resetParsing: () => void;
    clearError: () => void;
}

//Initial state 
const initialState = {
    parsedData: null,
    isLoading: false,
    error: null,
};

/**
 * Voice Store - Manages voice parsing state and operations
 * 
 */
export const useVoiceStore = create<VoiceState>()(
    devtools(
        (set) => ({
            ...initialState,
            parseVoice: async (audioBlob: Blob) => {
                set({ isLoading: true, error: null }, false, 'parseVoice/start');

                try {
                    const parsedData = await taskApi.parseVoiceInput(audioBlob);
                    set(
                        { parsedData, isLoading: false, error: null },
                        false,
                        'parseVoice/success'
                    );
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to parse voice input';
                    set(
                        { isLoading: false, error: errorMessage },
                        false,
                        'parseVoice/error'
                    );
                    throw error;
                }
            },
            resetParsing: () => {
                set(initialState, false, 'resetParsing');
            },
            clearError: () => {
                set({ error: null }, false, 'clearError');
            },
        }),
        { name: 'VoiceStore' }
    )
);

// selectors
export const useParsedDataSelector = () => useVoiceStore((state) => state.parsedData);
export const useVoiceLoadingSelector = () => useVoiceStore((state) => state.isLoading);
export const useVoiceErrorSelector = () => useVoiceStore((state) => state.error);
