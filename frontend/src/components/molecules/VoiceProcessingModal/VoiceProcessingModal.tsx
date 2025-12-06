import React, { memo } from 'react';
import { Dialog, DialogContent } from '@/components/atoms/dialog';
import { Loader2 } from 'lucide-react';

interface VoiceProcessingModalProps {
    isOpen: boolean;
}

/**
 * VoiceProcessingModal - Loading modal shown while voice input is being processed
 */
export const VoiceProcessingModal: React.FC<VoiceProcessingModalProps> = memo(({ isOpen }) => {
    return (
        <Dialog open={isOpen}>
            <DialogContent className="sm:max-w-md bg-white">
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <div className="text-center space-y-2">
                        <h3 className="text-lg font-semibold">Processing Voice Input</h3>
                        <p className="text-sm text-muted-foreground">
                            Analyzing your voice recording...
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
});
