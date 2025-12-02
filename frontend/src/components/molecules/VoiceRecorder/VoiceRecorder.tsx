import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/atoms/dialog";
import { Button } from "@/components/atoms/button";
import { Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import type { VoiceRecorderProps } from "./types";
import { formatTime } from "@/utils";

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
    isOpen,
    onClose,
    onRecordingComplete,
}) => {
    const {
        isRecording,
        recordTime,
        error,
        startRecording,
        stopRecording,
        cleanup,
    } = useVoiceRecorder(onRecordingComplete);

    const handleClose = () => {
        if (isRecording) stopRecording();
        cleanup();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Voice Input</DialogTitle>
                    <DialogDescription>
                        Click the microphone to start recording your task.
                    </DialogDescription>
                </DialogHeader>

                {/* CONTENT */}
                <div className="flex flex-col items-center py-8 space-y-6">
                    {/* Record Button */}
                    <button
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={!!error}
                        className={cn(
                            "relative flex items-center justify-center w-24 h-24 rounded-full transition-all",
                            isRecording
                                ? "bg-destructive hover:bg-destructive/90 animate-pulse"
                                : "bg-primary hover:bg-primary/90",
                            error && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {isRecording ? (
                            <Square className="w-10 h-10 text-white" />
                        ) : (
                            <Mic className="w-10 h-10 text-white" />
                        )}

                        {isRecording && (
                            <span className="absolute -bottom-1 -right-1 flex h-6 w-6">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                                <span className="relative inline-flex rounded-full h-6 w-6 bg-destructive" />
                            </span>
                        )}
                    </button>

                    {/* Timer */}
                    {isRecording && (
                        <div className="text-2xl font-mono font-semibold">
                            {formatTime(recordTime)}
                        </div>
                    )}

                    {/* Status Text */}
                    <p className="text-sm text-muted-foreground text-center">
                        {isRecording
                            ? "Recording... Click stop when finished."
                            : "Click the microphone to start recording."}
                    </p>

                    {/* Error */}
                    {error && <p className="text-sm text-destructive text-center">{error}</p>}
                </div>

                {/* FOOTER */}
                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
