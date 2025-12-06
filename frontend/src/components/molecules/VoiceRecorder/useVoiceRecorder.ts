import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook Props Interface
 */
interface UseVoiceRecorderProps {
    isOpen: boolean;
    onClose: () => void;
    onRecordingComplete: (audioBlob: Blob) => void;
}

/**
 * Hook Return Interface
 */
interface UseVoiceRecorderReturn {
    isRecording: boolean;
    recordTime: number;
    error: string | null;
    startRecording: () => Promise<void>;
    stopRecording: () => void;
    formatTime: (seconds: number) => string;
}

/**
 * useVoiceRecorder Hook
 * 
 * Business logic for VoiceRecorder molecule component.
 * Handles audio recording, timing, and error states.
 * 
 * @param props - Hook configuration
 * @returns Recording state and handlers
 * 
 * @example
 * const { isRecording, recordTime, startRecording, stopRecording } = useVoiceRecorder({
 *   isOpen,
 *   onClose,
 *   onRecordingComplete
 * });
 */
export const useVoiceRecorder = ({
    isOpen,
    onRecordingComplete,
}: UseVoiceRecorderProps): UseVoiceRecorderReturn => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordTime, setRecordTime] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    /**
     * Format seconds to MM:SS
     */
    const formatTime = useCallback((seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, []);

    /**
     * Start recording
     */
    const startRecording = useCallback(async () => {
        try {
            setError(null);
            audioChunksRef.current = [];

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                onRecordingComplete(audioBlob);
                stream.getTracks().forEach((track) => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);

            // Start timer
            setRecordTime(0);
            timerRef.current = setInterval(() => {
                setRecordTime((prev) => prev + 1);
            }, 1000);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to access microphone';
            setError(errorMessage);
            console.error('Recording error:', err);
        }
    }, [onRecordingComplete]);

    /**
     * Stop recording
     */
    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            // Clear timer
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    }, [isRecording]);

    /**
     * Cleanup on unmount or when modal closes
     */
    useEffect(() => {
        if (!isOpen) {
            stopRecording();
            setRecordTime(0);
            setError(null);
        }

        return () => {
            stopRecording();
        };
    }, [isOpen, stopRecording]);

    return {
        isRecording,
        recordTime,
        error,
        startRecording,
        stopRecording,
        formatTime,
    };
};
