import { useQuery } from '@tanstack/react-query';
import { AppError } from '../../../shared/http';
import { fetchTasks } from '../services/taskApi';
import { TaskFilters, TaskSummary } from '../types/task.types';
import { taskQueryKeys } from './queryKeys';

export const useTasks = (filters: TaskFilters) =>
  useQuery<TaskSummary[], AppError>({
    queryKey: taskQueryKeys.list(filters),
    queryFn: ({ signal }) => fetchTasks(filters, { signal }),
  });
