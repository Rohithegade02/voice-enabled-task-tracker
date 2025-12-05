import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/atoms/card';

interface TranscriptDisplayProps {
    transcript: string;
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ transcript }) => {
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
};
