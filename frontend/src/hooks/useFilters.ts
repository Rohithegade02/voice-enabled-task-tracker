import { useState, useCallback } from 'react';
import type { TaskFilters } from '@/types/task';

export const useFilters = (initialFilters: TaskFilters = {}) => {
    const [filters, setFilters] = useState<TaskFilters>(initialFilters);

    const updateFilters = useCallback((newFilters: Partial<TaskFilters>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({});
    }, []);

    return {
        filters,
        setFilters: updateFilters,
        clearFilters,
    };
};
