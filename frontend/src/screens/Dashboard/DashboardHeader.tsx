import { Button } from '@/components/atoms'
import { Mic, Plus } from 'lucide-react'
import type { DashboardHeaderProps } from './types'
import { memo } from 'react'

const DashboardHeader = memo(({
    onOpenVoiceRecorder,
    onOpenTaskForm
}: DashboardHeaderProps) => {
    return (
        <div
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            data-testid="dashboard-header"
        >
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Voice Enabled Task Tracker</h1>
                <p className="text-muted-foreground mt-1">
                    Keep track of your tasks with ease
                </p>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    onClick={onOpenVoiceRecorder}
                    className="gap-2"
                >
                    <Mic className="h-4 w-4" />
                    Voice Input
                </Button>
                <Button onClick={onOpenTaskForm} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Task
                </Button>
            </div>
        </div>
    )
})



export default DashboardHeader