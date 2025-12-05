import { Tabs, TabsList, TabsTrigger } from '@/components/atoms/tabs'
import { FilterBar } from '@/components/molecules'
import { LayoutGrid, ListIcon } from 'lucide-react'
import type { DashboardFilterBarProps } from './types'
import { memo } from 'react'

const DashboardFilterBar = memo(({
    filters,
    onFilterChange,
    onClearFilters,
    viewMode,
    onViewModeChange
}: DashboardFilterBarProps) => {
    return (
        <div
            className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
            data-testid="dashboard-filter-bar"
        >
            <div className="flex-1 w-full md:w-auto">
                <FilterBar
                    filters={filters}
                    onFilterChange={onFilterChange}
                    onClearFilters={onClearFilters}
                />
            </div>

            <Tabs
                value={viewMode}
                onValueChange={(v) => onViewModeChange(v as 'kanban' | 'list')}
                className="w-full md:w-auto"
            >
                <TabsList className="grid w-full grid-cols-2 md:w-auto">
                    <TabsTrigger value="kanban" className="gap-2">
                        <LayoutGrid className="h-4 w-4" />
                        Board
                    </TabsTrigger>
                    <TabsTrigger value="list" className="gap-2">
                        <ListIcon className="h-4 w-4" />
                        List
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    )
})

export default DashboardFilterBar