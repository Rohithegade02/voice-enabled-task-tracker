import React, { useCallback } from 'react';
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
 * ConfirmDialog component for displaying a confirmation dialog to the user.
 * It provides options to confirm or cancel an action.
 *
 * @param {ConfirmDialogProps} props - The props for the ConfirmDialog component.
 * @param {boolean} props.isOpen - Controls the visibility of the dialog.
 * @param {() => void} props.onClose - Callback function invoked when the dialog is closed (e.g., by clicking outside or cancel button).
 * @param {() => void} props.onConfirm - Callback function invoked when the confirm action is triggered.
 * @param {string} props.title - The title displayed in the dialog header.
 * @param {string} props.description - The descriptive text explaining the action to be confirmed.
 * @param {string} [props.confirmText='Continue'] - The text for the confirm button.
 * @param {string} [props.cancelText='Cancel'] - The text for the cancel button.
 * @param {boolean} [props.isDestructive=false] - If true, styles the confirm button to indicate a destructive action.
 */

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Continue',
    cancelText = 'Cancel',
    isDestructive = false,
}) => {
    const handleConfirm = useCallback(() => {
        onConfirm();
        onClose();
    }, [onConfirm, onClose]);

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>{cancelText}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        className={isDestructive ? 'bg-destructive hover:bg-destructive/90' : ''}
                    >
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
