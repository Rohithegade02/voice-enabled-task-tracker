import React, { Activity, memo, useCallback, useMemo } from 'react';
import { TaskStatus, TaskPriority } from '@/types';
import { Input } from '@/components/atoms/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/select';
import { Label } from '@/components/atoms/label';
import { Button } from '@/components/atoms/button';
import { Search, X } from 'lucide-react';
import type { FilterBarProps } from './types';

/**
 * FilterBar component for filtering tasks.
 * It provides a search bar and dropdowns for filtering tasks by status and priority.
 *
 * @param {FilterBarProps} props - The props for the FilterBar component.
 * @param {Filter} props.filters - The current filter state.
 * @param {() => void} props.onFilterChange - Callback function to update the filter state.
 * @param {() => void} props.onClearFilters - Callback function to clear all filters.
 */

export const FilterBar: React.FC<FilterBarProps> = memo(({
    filters,
    onFilterChange,
    onClearFilters,
}) => {
    const handleSearchChange = useCallback((value: string) => {
        onFilterChange({ ...filters, search: value || undefined });
    }, [filters, onFilterChange]);

    const handleStatusChange = useCallback((value: string) => {
        onFilterChange({
            ...filters,
            status: value === 'all' ? undefined : (value as TaskStatus)
        });
    }, [filters, onFilterChange]);

    const handlePriorityChange = useCallback((value: string) => {
        onFilterChange({
            ...filters,
            priority: value === 'all' ? undefined : (value as TaskPriority)
        });
    }, [filters, onFilterChange]);

    const hasActiveFilters = useMemo(() => filters.status || filters.priority || filters.search, [filters]);

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-2">
                    <Label htmlFor="search" className="sr-only">Search</Label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="search"
                            type="text"
                            placeholder="Search tasks..."
                            value={filters.search || ''}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>
                <div className="w-full sm:w-[180px] space-y-2">
                    <Label htmlFor="status-filter" className="sr-only">Status</Label>
                    <Select
                        value={filters.status || 'all'}
                        onValueChange={handleStatusChange}
                    >
                        <SelectTrigger id="status-filter">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value={TaskStatus.TODO}>{TaskStatus.TODO}</SelectItem>
                            <SelectItem value={TaskStatus.IN_PROGRESS}>{TaskStatus.IN_PROGRESS}</SelectItem>
                            <SelectItem value={TaskStatus.DONE}>{TaskStatus.DONE}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-full sm:w-[180px] space-y-2">
                    <Label htmlFor="priority-filter" className="sr-only">Priority</Label>
                    <Select
                        value={filters.priority || 'all'}
                        onValueChange={handlePriorityChange}
                    >
                        <SelectTrigger id="priority-filter">
                            <SelectValue placeholder="All Priorities" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Priorities</SelectItem>
                            <SelectItem value={TaskPriority.HIGH}>{TaskPriority.HIGH}</SelectItem>
                            <SelectItem value={TaskPriority.MEDIUM}>{TaskPriority.MEDIUM}</SelectItem>
                            <SelectItem value={TaskPriority.LOW}>{TaskPriority.LOW}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Activity mode={hasActiveFilters ? 'visible' : 'hidden'}>
                    <Button
                        variant="outline"
                        size="default"
                        onClick={onClearFilters}
                        className="w-full sm:w-auto"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Clear
                    </Button>
                </Activity>
            </div>
        </div>
    );
});
