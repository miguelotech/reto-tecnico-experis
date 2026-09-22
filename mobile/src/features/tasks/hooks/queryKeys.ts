import { TaskFilters } from '../types/task.types';

export const taskQueryKeys = {
  all: ['tasks'] as const,
  list: (filters: TaskFilters) => ['tasks', 'list', filters.status, filters.priority] as const,
  detail: (id: string) => ['tasks', 'detail', id] as const,
};

export const catalogQueryKeys = {
  priorities: ['catalogs', 'priorities'] as const,
  statuses: ['catalogs', 'statuses'] as const,
};
