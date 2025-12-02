import React from 'react';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/atoms/button';
import type { EmptyStateProps } from './types';


export const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    description,
    action,
    icon,
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="mb-4 text-muted-foreground">
                {icon || <FileQuestion className="h-16 w-16" />}
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
                {description}
            </p>
            {action && (
                <Button onClick={action.onClick}>
                    {action.label}
                </Button>
            )}
        </div>
    );
};
