import React, { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import { AppError } from '../../../../shared/http';
import { fetchTasks } from '../../services/taskApi';
import { EMPTY_FILTERS, TaskSummary } from '../../types/task.types';
import { useTasks } from '../useTasks';

jest.mock('../../services/taskApi');

const fetchTasksMock = fetchTasks as jest.MockedFunction<typeof fetchTasks>;

const task: TaskSummary = {
  id: 'aaaaaaaa-0000-4000-8000-000000000001',
  title: 'Renovar el pasaporte',
  description: 'La cita se agenda en linea',
  priority: { code: 'HIGH', name: 'Alta' },
  status: { code: 'PENDING', name: 'Pendiente' },
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useTasks', () => {
  beforeEach(() => {
    fetchTasksMock.mockReset();
  });

  it('devuelve las tareas cuando el servicio responde', async () => {
    fetchTasksMock.mockResolvedValue([task]);

    const { result } = renderHook(() => useTasks(EMPTY_FILTERS), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([task]);
  });

  it('propaga los filtros activos al servicio', async () => {
    fetchTasksMock.mockResolvedValue([]);
    const filters = { status: 'PENDING', priority: 'HIGH' };

    const { result } = renderHook(() => useTasks(filters), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchTasksMock).toHaveBeenCalledWith(filters, expect.anything());
  });

  it('expone una lista vacia sin tratarla como error', async () => {
    fetchTasksMock.mockResolvedValue([]);

    const { result } = renderHook(() => useTasks(EMPTY_FILTERS), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('expone el AppError normalizado cuando el servicio falla', async () => {
    const appError: AppError = {
      kind: 'unavailable',
      title: 'Servicio no disponible',
      message: 'La base de datos no responde.',
      status: 503,
      retryable: true,
    };
    fetchTasksMock.mockRejectedValue(appError);

    const { result } = renderHook(() => useTasks(EMPTY_FILTERS), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(appError);
  });
});
