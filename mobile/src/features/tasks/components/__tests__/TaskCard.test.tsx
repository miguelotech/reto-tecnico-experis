import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { TaskSummary } from '../../types/task.types';
import { TaskCard } from '../TaskCard';

const task: TaskSummary = {
  id: 'aaaaaaaa-0000-4000-8000-000000000001',
  title: 'Renovar el pasaporte',
  description: 'La cita en migraciones se agenda en linea',
  priority: { code: 'HIGH', name: 'Alta' },
  status: { code: 'PENDING', name: 'Pendiente' },
};

describe('TaskCard', () => {
  it('muestra el titulo, la descripcion y los badges de prioridad y estado', async () => {
    await render(<TaskCard task={task} onPress={jest.fn()} />);

    expect(screen.getByText('Renovar el pasaporte')).toBeTruthy();
    expect(screen.getByText('La cita en migraciones se agenda en linea')).toBeTruthy();
    expect(screen.getByText('Alta')).toBeTruthy();
    expect(screen.getByText('Pendiente')).toBeTruthy();
  });

  it('usa un texto placeholder cuando la tarea no tiene descripcion', async () => {
    await render(<TaskCard task={{ ...task, description: null }} onPress={jest.fn()} />);

    expect(screen.getByText('Sin descripción')).toBeTruthy();
  });

  it('entrega la tarea completa al presionarse', async () => {
    const onPress = jest.fn();
    await render(<TaskCard task={task} onPress={onPress} />);

    await fireEvent.press(screen.getByTestId(`task-card-${task.id}`));

    expect(onPress).toHaveBeenCalledWith(task);
  });
});
