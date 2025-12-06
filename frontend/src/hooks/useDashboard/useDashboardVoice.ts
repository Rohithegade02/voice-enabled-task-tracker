import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import type { CreateTaskDTO } from '@/types';
import type { useVoiceStore } from '@/stores/useVoiceStore';
import type { useTaskStore } from '@/stores/useTaskStore';

interface UseDashboardVoiceProps {
    voiceStore: ReturnType<typeof useVoiceStore.getState>;
    taskStore: ReturnType<typeof useTaskStore.getState>;
    setShowVoiceRecorder: (show: boolean) => void;
}

/**
 * useDashboardVoice Hook
 * 
 * Handles voice input operations.
 * Manages voice recording, parsing, and task creation from voice.
 * 
 * @param props - Voice and task stores, UI setters
 * @returns Voice operation handlers
 */
export const useDashboardVoice = ({
    voiceStore,
    taskStore,
    setShowVoiceRecorder,

}: UseDashboardVoiceProps) => {
    const {
        error: voiceError,
        parseVoice,
        resetParsing,
        clearError: clearVoiceError
    } = voiceStore;
    const { createTask } = taskStore;

    // display voice error toasts
    useEffect(() => {
        if (voiceError) {
            toast.error(voiceError);
            clearVoiceError();
        }
    }, [voiceError, clearVoiceError]);

    // handle voice recording completion
    const handleVoiceRecordingComplete = useCallback(
        async (audioBlob: Blob) => {
            setShowVoiceRecorder(false);

            try {
                await parseVoice(audioBlob);
            } catch (err) {
                console.error('Voice parsing error:', err);
            }
        },
        [parseVoice, setShowVoiceRecorder]
    );

    // handle voice parse confirmation
    const handleVoiceParseConfirm = useCallback(
        async (data: CreateTaskDTO) => {
            try {
                await createTask(data);
                resetParsing();
                toast.success('Task created from voice input');
            } catch (err) {
                console.error('Voice task creation error:', err);
            }
        },
        [createTask, resetParsing]
    );

    // handle closing voice preview modal
    const handleCloseVoicePreview = useCallback(() => {
        resetParsing();
    }, [resetParsing]);

    return {
        handleVoiceRecordingComplete,
        handleVoiceParseConfirm,
        onCloseVoicePreview: handleCloseVoicePreview,
    };
};