import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { TaskFilters } from '@/types';

/**
 * Filter Store State Interface
 */
interface FilterState {
    // State
    filters: TaskFilters;

    // Actions
    setFilters: (filters: Partial<TaskFilters>) => void;
    setSearch: (search: string) => void;
    setStatus: (status: TaskFilters['status']) => void;
    setPriority: (priority: TaskFilters['priority']) => void;
    setDateRange: (dueDateFrom?: string, dueDateTo?: string) => void;
    clearFilters: () => void;
}

/**
 * Initial filter state
 */
const initialFilters: TaskFilters = {
    status: undefined,
    priority: undefined,
    search: '',
    dueDateFrom: undefined,
    dueDateTo: undefined,
};

/**
 * Filter Store - Manages task filter state
 * 
 * @example
 * const { filters, setSearch, setStatus, clearFilters } = useFilterStore();
 * 
 * // Update search
 * setSearch('important task');
 * 
 * // Update status filter
 * setStatus(TaskStatus.TODO);
 * 
 * // Clear all filters
 * clearFilters();
 */
export const useFilterStore = create<FilterState>()(
    devtools(
        (set) => ({
            filters: initialFilters,

            /**
             * Set multiple filters at once
             */
            setFilters: (newFilters: Partial<TaskFilters>) => {
                set(
                    (state) => ({
                        filters: { ...state.filters, ...newFilters },
                    }),
                    false,
                    'setFilters'
                );
            },

            /**
             * Set search filter
             */
            setSearch: (search: string) => {
                set(
                    (state) => ({
                        filters: { ...state.filters, search },
                    }),
                    false,
                    'setSearch'
                );
            },

            /**
             * Set status filter
             */
            setStatus: (status: TaskFilters['status']) => {
                set(
                    (state) => ({
                        filters: { ...state.filters, status },
                    }),
                    false,
                    'setStatus'
                );
            },

            /**
             * Set priority filter
             */
            setPriority: (priority: TaskFilters['priority']) => {
                set(
                    (state) => ({
                        filters: { ...state.filters, priority },
                    }),
                    false,
                    'setPriority'
                );
            },

            /**
             * Set date range filter
             */
            setDateRange: (dueDateFrom?: string, dueDateTo?: string) => {
                set(
                    (state) => ({
                        filters: { ...state.filters, dueDateFrom, dueDateTo },
                    }),
                    false,
                    'setDateRange'
                );
            },

            /**
             * Clear all filters
             */
            clearFilters: () => {
                set({ filters: initialFilters }, false, 'clearFilters');
            },
        }),
        { name: 'FilterStore' }
    )
);

/**
 * Selectors for optimized component re-renders
 */
export const useFiltersSelector = () => useFilterStore((state) => state.filters);
export const useSearchSelector = () => useFilterStore((state) => state.filters.search);
