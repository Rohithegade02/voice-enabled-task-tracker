import React, { useCallback, useMemo } from 'react';
import { TaskStatus, TaskPriority } from '@/types/task';
import { Input } from '@/components/atoms/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/select';
import { Label } from '@/components/atoms/label';
import { Button } from '@/components/atoms/button';
import { Search, X } from 'lucide-react';
import type { FilterBarProps } from './types';


export const FilterBar: React.FC<FilterBarProps> = ({
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
                {/* Search */}
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

                {/* Status Filter */}
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
                            <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
                            <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                            <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Priority Filter */}
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
                            <SelectItem value={TaskPriority.HIGH}>High</SelectItem>
                            <SelectItem value={TaskPriority.MEDIUM}>Medium</SelectItem>
                            <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        size="default"
                        onClick={onClearFilters}
                        className="w-full sm:w-auto"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Clear
                    </Button>
                )}
            </div>
        </div>
    );
};
