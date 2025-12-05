import { useState, useCallback, useMemo } from 'react';
import type { TaskFilters } from '@/types';

interface UseFiltersReturn {
    filters: TaskFilters;
    setFilters: (newFilters: Partial<TaskFilters>) => void;
    clearFilters: () => void;
    hasActiveFilters: boolean;
}

/**
 * Custom hook for managing task filter state
 * Provides filter management with active filter detection
 */
export const useFilters = (initialFilters: TaskFilters = {}): UseFiltersReturn => {
    const [filters, setFiltersState] = useState<TaskFilters>(initialFilters);

    const updateFilters = useCallback((newFilters: Partial<TaskFilters>) => {
        setFiltersState((prev) => ({ ...prev, ...newFilters }));
    }, []);

    const clearFilters = useCallback(() => {
        setFiltersState({});
    }, []);

    const hasActiveFilters = useMemo(() => {
        return Object.keys(filters).some((key) => {
            const value = filters[key as keyof TaskFilters];
            return value !== undefined && value !== null && value !== '';
        });
    }, [filters]);

    return {
        filters,
        setFilters: updateFilters,
        clearFilters,
        hasActiveFilters,
    };
};
