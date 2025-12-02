export interface VoiceRecorderProps {
    isOpen: boolean;
    onClose: () => void;
    onRecordingComplete: (audioBlob: Blob) => void;
}