import { useCallback, useEffect } from 'react';
import { useDebounce } from '@/hooks';
import { toast } from 'sonner';
import type { useFilterStore } from '@/stores/useFilterStore';
import type { useTaskStore } from '@/stores/useTaskStore';

interface UseDashboardFiltersProps {
    filterStore: ReturnType<typeof useFilterStore.getState>;
    taskStore: ReturnType<typeof useTaskStore.getState>;
}

/**
 * useDashboardFilters Hook
 * 
 * Handles filter operations and task fetching based on filters.
 * Includes debouncing for search input.
 * 
 * @param props - Filter and task stores
 * @returns Filter operation handlers
 */
export const useDashboardFilters = ({
    filterStore,
    taskStore,
}: UseDashboardFiltersProps) => {
    const { filters, setFilters, clearFilters } = filterStore;
    const { fetchTasks, error, clearError } = taskStore;

    // Debounce search 
    const debouncedSearch = useDebounce(filters?.search, 500);

    // fetch tasks when filters change
    useEffect(() => {
        const filtersWithSearch = { ...filters, search: debouncedSearch };
        fetchTasks(filtersWithSearch);
    }, [
        fetchTasks,
        filters.status,
        filters.priority,
        filters.dueDateFrom,
        filters.dueDateTo,
        debouncedSearch,
    ]);

    // display error toasts
    useEffect(() => {
        if (error) {
            toast.error(error);
            clearError();
        }
    }, [error, clearError]);

    // handle filter change
    const handleFilterChange = useCallback(
        (newFilters: typeof filters) => {
            setFilters(newFilters);
        },
        [setFilters]
    );

    return {
        handleFilterChange,
        clearFilters,
    };
};