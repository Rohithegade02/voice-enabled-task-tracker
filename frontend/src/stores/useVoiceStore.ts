import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { taskApi } from '@/services/api';
import type { ParsedVoiceInput } from '@/types';

/**
 * Voice Store State Interface
 */
interface VoiceState {
    // State
    parsedData: ParsedVoiceInput | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    parseVoice: (audioBlob: Blob) => Promise<void>;
    resetParsing: () => void;
    clearError: () => void;
}

/**
 * Initial state for the voice store
 */
const initialState = {
    parsedData: null,
    isLoading: false,
    error: null,
};

/**
 * Voice Store - Manages voice parsing state and operations
 * 
 * @example
 * const { parsedData, parseVoice, resetParsing } = useVoiceStore();
 * 
 * // Parse voice input
 * await parseVoice(audioBlob);
 * 
 * // Reset after use
 * resetParsing();
 */
export const useVoiceStore = create<VoiceState>()(
    devtools(
        (set) => ({
            ...initialState,

            /**
             * Parse voice input from audio blob
             */
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

            /**
             * Reset parsing state
             */
            resetParsing: () => {
                set(initialState, false, 'resetParsing');
            },

            /**
             * Clear error state
             */
            clearError: () => {
                set({ error: null }, false, 'clearError');
            },
        }),
        { name: 'VoiceStore' }
    )
);

/**
 * Selectors for optimized component re-renders
 */
export const useParsedDataSelector = () => useVoiceStore((state) => state.parsedData);
export const useVoiceLoadingSelector = () => useVoiceStore((state) => state.isLoading);
export const useVoiceErrorSelector = () => useVoiceStore((state) => state.error);
