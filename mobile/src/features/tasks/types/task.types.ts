export type CatalogItem = {
  code: string;
  name: string;
};

export type TaskSummary = {
  id: string;
  title: string;
  description: string | null;
  priority: CatalogItem;
  status: CatalogItem;
};

export type TaskDetail = TaskSummary & {
  dueDate: string | null;
  createdAt: string;
};

export type TaskFilters = {
  status: string | null;
  priority: string | null;
};

export const EMPTY_FILTERS: TaskFilters = {
  status: null,
  priority: null,
};

export const countActiveFilters = (filters: TaskFilters): number =>
  [filters.status, filters.priority].filter(Boolean).length;

export const hasActiveFilters = (filters: TaskFilters): boolean => countActiveFilters(filters) > 0;
