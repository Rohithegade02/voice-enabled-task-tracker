import { useState, useRef, useCallback, useEffect } from 'react';

interface UseVoiceRecorderReturn {
    isRecording: boolean;
    recordTime: number;
    error: string | null;
    startRecording: () => Promise<void>;
    stopRecording: () => void;
    cleanup: () => void;
    clearError: () => void;
}

/**
 * Custom hook for managing audio recording
 * Handles MediaRecorder API with proper cleanup and error handling
 */
export const useVoiceRecorder = (
    onRecordingComplete?: (blob: Blob) => void
): UseVoiceRecorderReturn => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordTime, setRecordTime] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const recorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const stopTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const reset = useCallback(() => {
        setIsRecording(false);
        setRecordTime(0);
        stopTimer();
    }, [stopTimer]);

    const stopRecording = useCallback(() => {
        if (recorderRef.current?.state === 'recording') {
            recorderRef.current.stop();
        }
    }, []);

    const startRecording = useCallback(async () => {
        try {
            setError(null);

            // Check for browser support
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Your browser does not support audio recording');
            }

            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            // Check for MediaRecorder support
            if (!window.MediaRecorder) {
                throw new Error('MediaRecorder is not supported in your browser');
            }

            const recorder = new MediaRecorder(stream);
            recorderRef.current = recorder;
            chunksRef.current = [];

            recorder.ondataavailable = (e: BlobEvent) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });

                // Stop all tracks
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach((track) => track.stop());
                    streamRef.current = null;
                }

                // Call completion callback
                if (onRecordingComplete && blob.size > 0) {
                    onRecordingComplete(blob);
                }

                reset();
            };

            recorder.onerror = (event: Event) => {
                console.error('[MediaRecorder] Error:', event);
                setError('Recording failed. Please try again.');
                reset();
            };

            recorder.start();
            setIsRecording(true);

            // Start timer
            timerRef.current = setInterval(() => {
                setRecordTime((t) => t + 1);
            }, 1000);
        } catch (err) {
            console.error('[useVoiceRecorder] Start error:', err);

            if (err instanceof Error) {
                if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                    setError('Microphone access denied. Please allow microphone permissions.');
                } else if (err.name === 'NotFoundError') {
                    setError('No microphone found. Please connect a microphone.');
                } else {
                    setError(err.message || 'Failed to start recording');
                }
            } else {
                setError('Failed to start recording');
            }
        }
    }, [onRecordingComplete, reset]);

    const cleanup = useCallback(() => {
        stopRecording();
        stopTimer();

        // Stop all media tracks
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }

        reset();
    }, [stopRecording, stopTimer, reset]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            cleanup();
        };
    }, [cleanup]);

    return {
        isRecording,
        recordTime,
        error,
        startRecording,
        stopRecording,
        cleanup,
        clearError,
    };
};
