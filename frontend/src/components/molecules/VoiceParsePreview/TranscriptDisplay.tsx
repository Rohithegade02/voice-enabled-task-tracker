import React, { memo } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/atoms/card';
import type { TranscriptDisplayProps } from './types';

/**
 * TranscriptDisplay component for displaying a transcript.
 * It shows a card with the transcript.
 *
 * @param {TranscriptDisplayProps} props - The props for the TranscriptDisplay component.
 * @param {string} props.transcript - The transcript to be displayed.
 */

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = memo(({ transcript }) => {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    Voice Transcript
                </CardTitle>
                <p className="text-sm text-muted-foreground italic">
                    "{transcript}"
                </p>
            </CardHeader>
        </Card>
    );
});
