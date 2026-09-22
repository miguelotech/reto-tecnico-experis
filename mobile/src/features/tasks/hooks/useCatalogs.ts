import { useQueries } from '@tanstack/react-query';
import { AppError } from '../../../shared/http';
import { fetchPriorities, fetchStatuses } from '../services/taskApi';
import { CatalogItem } from '../types/task.types';
import { catalogQueryKeys } from './queryKeys';

const CATALOG_STALE_TIME_MS = 30 * 60 * 1000;

export const useCatalogs = () => {
  const [priorities, statuses] = useQueries({
    queries: [
      {
        queryKey: catalogQueryKeys.priorities,
        queryFn: ({ signal }: { signal: AbortSignal }) => fetchPriorities({ signal }),
        staleTime: CATALOG_STALE_TIME_MS,
      },
      {
        queryKey: catalogQueryKeys.statuses,
        queryFn: ({ signal }: { signal: AbortSignal }) => fetchStatuses({ signal }),
        staleTime: CATALOG_STALE_TIME_MS,
      },
    ],
  });

  return {
    priorities: (priorities.data ?? []) as CatalogItem[],
    statuses: (statuses.data ?? []) as CatalogItem[],
    isLoading: priorities.isPending || statuses.isPending,
    error: (priorities.error ?? statuses.error) as AppError | null,
    refetch: () => {
      priorities.refetch();
      statuses.refetch();
    },
  };
};
