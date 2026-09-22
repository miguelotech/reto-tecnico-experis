import { httpClient } from '../../../shared/http';
import { CatalogItem, TaskDetail, TaskFilters, TaskSummary } from '../types/task.types';

type RequestOptions = {
  signal?: AbortSignal;
};

export const fetchTasks = async (
  filters: TaskFilters,
  { signal }: RequestOptions = {},
): Promise<TaskSummary[]> => {
  const { data } = await httpClient.get<TaskSummary[]>('/api/v1/tasks', {
    params: {
      status: filters.status ?? undefined,
      priority: filters.priority ?? undefined,
    },
    signal,
  });

  return data;
};

export const fetchTaskById = async (id: string, { signal }: RequestOptions = {}): Promise<TaskDetail> => {
  const { data } = await httpClient.get<TaskDetail>(`/api/v1/tasks/${id}`, { signal });

  return data;
};

export const fetchPriorities = async ({ signal }: RequestOptions = {}): Promise<CatalogItem[]> => {
  const { data } = await httpClient.get<CatalogItem[]>('/api/v1/catalogs/priorities', { signal });

  return data;
};

export const fetchStatuses = async ({ signal }: RequestOptions = {}): Promise<CatalogItem[]> => {
  const { data } = await httpClient.get<CatalogItem[]>('/api/v1/catalogs/statuses', { signal });

  return data;
};
