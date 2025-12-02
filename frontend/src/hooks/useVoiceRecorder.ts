import { useState, useRef, useCallback } from "react";

export const useVoiceRecorder = (onRecordingComplete?: (blob: Blob) => void) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordTime, setRecordTime] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const recorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const stopTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
    };

    const reset = () => {
        setIsRecording(false);
        setRecordTime(0);
        stopTimer();
    };

    const stopRecording = useCallback(() => {
        if (recorderRef.current?.state === "recording") {
            recorderRef.current.stop();
        }
    }, []);

    const startRecording = async () => {
        try {
            setError(null);

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);

            recorderRef.current = recorder;
            chunksRef.current = [];

            recorder.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);

            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: "audio/webm" });

                if (onRecordingComplete) onRecordingComplete(blob);

                stream.getTracks().forEach((t) => t.stop());
                reset();
            };

            recorder.start();
            setIsRecording(true);

            timerRef.current = setInterval(() => {
                setRecordTime((t) => t + 1);
            }, 1000);
        } catch (err) {
            console.error(err);
            setError("Failed to access microphone. Check permissions.");
        }
    };

    const cleanup = () => {
        stopRecording();
        reset();
    };

    return {
        isRecording,
        recordTime,
        error,
        startRecording,
        stopRecording,
        cleanup,
    };
};
