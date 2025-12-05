import React, { Activity, memo } from 'react';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/atoms/button';
import type { EmptyStateProps } from './types';

/**
 * EmptyState component for displaying an empty state message.
 * It shows a message with an optional action button.
 *
 * @param {EmptyStateProps} props - The props for the EmptyState component.
 * @param {string} props.title - The title displayed in the empty state.
 * @param {string} props.description - The descriptive text explaining the empty state.
 * @param {{ label: string; onClick: () => void } | null} [props.action=null] - The action button to be displayed.
 * @param {ReactNode} [props.icon=null] - The icon to be displayed in the empty state.
 */

export const EmptyState: React.FC<EmptyStateProps> = memo(({
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
            <Activity mode={action ? "visible" : "hidden"}>
                <Button onClick={action?.onClick}>
                    {action?.label}
                </Button>
            </Activity>
        </div>
    );
});
