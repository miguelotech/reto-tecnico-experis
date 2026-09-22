import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { useCatalogs } from '../../hooks/useCatalogs';
import { EMPTY_FILTERS } from '../../types/task.types';
import { TaskFilterScreen } from '../TaskFilterScreen';

jest.mock('../../hooks/useCatalogs');

const useCatalogsMock = useCatalogs as jest.MockedFunction<typeof useCatalogs>;

const catalogs = {
  priorities: [
    { code: 'HIGH', name: 'Alta' },
    { code: 'MEDIUM', name: 'Media' },
    { code: 'LOW', name: 'Baja' },
  ],
  statuses: [
    { code: 'PENDING', name: 'Pendiente' },
    { code: 'IN_PROGRESS', name: 'En progreso' },
    { code: 'COMPLETED', name: 'Completada' },
  ],
  isLoading: false,
  error: null,
  refetch: jest.fn(),
};

const renderScreen = (filters = EMPTY_FILTERS) => {
  const navigation = { navigate: jest.fn() };
  const route = { params: { filters } };

  render(<TaskFilterScreen navigation={navigation as never} route={route as never} />);

  return navigation;
};

describe('TaskFilterScreen', () => {
  beforeEach(() => {
    useCatalogsMock.mockReturnValue(catalogs);
  });

  it('aplica la combinacion de estado y prioridad seleccionada', () => {
    const navigation = renderScreen();

    fireEvent.press(screen.getByTestId('status-PENDING'));
    fireEvent.press(screen.getByTestId('priority-HIGH'));
    fireEvent.press(screen.getByTestId('apply-filters-button'));

    expect(navigation.navigate).toHaveBeenCalledWith('TaskList', {
      filters: { status: 'PENDING', priority: 'HIGH' },
    });
  });

  it('limpia los filtros que llegaron desde el listado', () => {
    const navigation = renderScreen({ status: 'COMPLETED', priority: 'LOW' });

    fireEvent.press(screen.getByTestId('clear-filters-button'));
    fireEvent.press(screen.getByTestId('apply-filters-button'));

    expect(navigation.navigate).toHaveBeenCalledWith('TaskList', { filters: EMPTY_FILTERS });
  });

  it('permite volver a "Todos" en un solo criterio sin tocar el otro', () => {
    const navigation = renderScreen({ status: 'COMPLETED', priority: 'LOW' });

    fireEvent.press(screen.getByTestId('status-all'));
    fireEvent.press(screen.getByTestId('apply-filters-button'));

    expect(navigation.navigate).toHaveBeenCalledWith('TaskList', {
      filters: { status: null, priority: 'LOW' },
    });
  });
});
