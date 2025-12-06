import { TaskForm, VoiceParsePreview, VoiceRecorder } from '@/components/molecules'
import { VoiceProcessingModal } from '@/components/molecules/VoiceProcessingModal'
import React from 'react'
import type { DashboardModalProps } from './types'

const DashboardModal = ({
    showTaskForm,
    onCloseTaskForm,
    handleTaskSubmit,
    editingTask,
    showVoiceRecorder,
    onCloseVoiceRecorder,
    onVoiceRecordingComplete,
    parsedVoiceData,
    onCloseVoicePreview,
    onVoiceParseConfirm,
    isParsingVoice
}: DashboardModalProps) => {
    return (
        <React.Fragment>
            <TaskForm
                isOpen={showTaskForm}
                onClose={onCloseTaskForm}
                onSubmit={handleTaskSubmit}
                initialData={editingTask || undefined}
                mode={editingTask ? 'edit' : 'create'}
            />

            <VoiceRecorder
                isOpen={showVoiceRecorder}
                onClose={onCloseVoiceRecorder}
                onRecordingComplete={onVoiceRecordingComplete}
            />

            <VoiceProcessingModal isOpen={isParsingVoice && !parsedVoiceData} />

            {parsedVoiceData && (
                <VoiceParsePreview
                    isOpen={!!parsedVoiceData}
                    onClose={onCloseVoicePreview}
                    parsedData={parsedVoiceData}
                    onConfirm={onVoiceParseConfirm}
                    isLoading={isParsingVoice}
                />
            )}
        </React.Fragment>
    )
}

export default DashboardModal