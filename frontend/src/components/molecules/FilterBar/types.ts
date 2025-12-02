import type { TaskFilters } from "@/types/task";

export interface FilterBarProps {
    filters: TaskFilters;
    onFilterChange: (filters: TaskFilters) => void;
    onClearFilters: () => void;
}
