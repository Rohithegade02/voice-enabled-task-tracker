import { memo } from 'react'
import { FilterBar } from '@/components/molecules'
import { LayoutGrid, List } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DashboardFilterBarProps } from './types'

export const DashboardFilterBar = memo(({
    filters,
    onFilterChange,
    onClearFilters,
    viewMode,
    onViewModeChange,
}: DashboardFilterBarProps) => {
    return (
        <div
            className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
            data-testid="dashboard-filter-bar"
        >
            <div className="inline-flex border-b border-gray-200 items-center gap-3 md:gap-6 w-full md:w-auto">
                <button
                    onClick={() => onViewModeChange('kanban')}
                    className={cn(
                        "inline-flex items-center gap-1.5 md:gap-2 pb-2 text-xs md:text-sm font-medium transition-colors border-b-2",
                        viewMode === 'kanban'
                            ? "text-primary border-primary"
                            : "text-muted-foreground border-transparent hover:text-foreground"
                    )}
                >
                    <LayoutGrid className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    Board
                </button>
                <button
                    onClick={() => onViewModeChange('list')}
                    className={cn(
                        "inline-flex items-center gap-1.5 md:gap-2 pb-2 text-xs md:text-sm font-medium transition-colors border-b-2",
                        viewMode === 'list'
                            ? "text-primary border-primary"
                            : "text-muted-foreground border-transparent hover:text-foreground"
                    )}
                >
                    <List className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    List
                </button>
            </div>

            <div className="flex-1 w-full md:w-auto">
                <FilterBar
                    filters={filters}
                    onFilterChange={onFilterChange}
                    onClearFilters={onClearFilters}
                />
            </div>
        </div>
    )
})

export default DashboardFilterBar