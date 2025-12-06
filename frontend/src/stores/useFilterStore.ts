import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { TaskFilters } from '@/types';

interface FilterState {
    filters: TaskFilters;
    setFilters: (filters: Partial<TaskFilters>) => void;
    setSearch: (search: string) => void;
    setStatus: (status: TaskFilters['status']) => void;
    setPriority: (priority: TaskFilters['priority']) => void;
    setDateRange: (dueDateFrom?: string, dueDateTo?: string) => void;
    clearFilters: () => void;
}

// initial values
const initialFilters: TaskFilters = {
    status: undefined,
    priority: undefined,
    search: '',
    dueDateFrom: undefined,
    dueDateTo: undefined,
};

/**
 * Filter Store - Manages task filter state
 */
export const useFilterStore = create<FilterState>()(
    devtools(
        (set) => ({
            filters: initialFilters,
            setFilters: (newFilters: Partial<TaskFilters>) => {
                set(
                    (state) => ({
                        filters: { ...state.filters, ...newFilters },
                    }),
                    false,
                    'setFilters'
                );
            },
            setSearch: (search: string) => {
                set(
                    (state) => ({
                        filters: { ...state.filters, search },
                    }),
                    false,
                    'setSearch'
                );
            },
            setStatus: (status: TaskFilters['status']) => {
                set(
                    (state) => ({
                        filters: { ...state.filters, status },
                    }),
                    false,
                    'setStatus'
                );
            },
            setPriority: (priority: TaskFilters['priority']) => {
                set(
                    (state) => ({
                        filters: { ...state.filters, priority },
                    }),
                    false,
                    'setPriority'
                );
            },
            setDateRange: (dueDateFrom?: string, dueDateTo?: string) => {
                set(
                    (state) => ({
                        filters: { ...state.filters, dueDateFrom, dueDateTo },
                    }),
                    false,
                    'setDateRange'
                );
            },
            clearFilters: () => {
                set({ filters: initialFilters }, false, 'clearFilters');
            },
        }),
        { name: 'FilterStore' }
    )
);
// selectors 
export const useFiltersSelector = () => useFilterStore((state) => state.filters);
export const useSearchSelector = () => useFilterStore((state) => state.filters.search);
