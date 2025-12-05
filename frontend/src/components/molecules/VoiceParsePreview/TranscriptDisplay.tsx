import React, { memo } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/atoms/card';
import type { TranscriptDisplayProps } from './types';

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
