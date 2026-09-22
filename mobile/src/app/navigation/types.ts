import { TaskFilters } from '../../features/tasks/types/task.types';

export type RootStackParamList = {
  TaskList: { filters: TaskFilters } | undefined;
  TaskFilter: { filters: TaskFilters };
  TaskDetail: { taskId: string };
};
