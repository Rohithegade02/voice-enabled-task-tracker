import type { TaskFilters } from "@/types";

export interface FilterBarProps {
    filters: TaskFilters;
    onFilterChange: (filters: TaskFilters) => void;
    onClearFilters: () => void;
}
