import { useQuery } from '@tanstack/react-query';
import { AppError } from '../../../shared/http';
import { fetchTaskById } from '../services/taskApi';
import { TaskDetail } from '../types/task.types';
import { taskQueryKeys } from './queryKeys';

export const useTaskDetail = (id: string) =>
  useQuery<TaskDetail, AppError>({
    queryKey: taskQueryKeys.detail(id),
    queryFn: ({ signal }) => fetchTaskById(id, { signal }),
  });
