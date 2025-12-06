import React, { memo, useCallback } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/atoms/alert-dialog';
import type { ConfirmDialogProps } from './types';

/**
 * ConfirmDialog component for displaying confirmation dialogs.
 * Uses AlertDialog from shadcn/ui with custom confirmation logic.
 *
 * @param {ConfirmDialogProps} props - The props for the ConfirmDialog component.
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = memo(({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDestructive = false,
}) => {
    const handleConfirm = useCallback(async () => {
        try {
            await onConfirm();
            onClose();
        } catch (error) {
            console.error('Confirm dialog error:', error);
        }
    }, [onConfirm, onClose]);

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        className={isDestructive ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
                    >
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
});
