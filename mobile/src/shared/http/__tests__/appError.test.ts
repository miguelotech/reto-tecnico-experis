import { AxiosError, AxiosHeaders } from 'axios';
import { toAppError } from '../appError';

const axiosErrorWithResponse = (status: number, data: unknown): AxiosError => {
  const config = { headers: new AxiosHeaders() };
  const error = new AxiosError('request failed', 'ERR_BAD_REQUEST', config as never);

  error.response = {
    status,
    statusText: '',
    data,
    headers: new AxiosHeaders(),
    config: config as never,
  };

  return error;
};

describe('toAppError', () => {
  it('traduce un ProblemDetails de filtro invalido conservando el detalle del backend', () => {
    const error = toAppError(
      axiosErrorWithResponse(400, {
        title: 'Filtro invalido',
        detail: "El valor 'NOPE' no es valido para el filtro 'priority'.",
        status: 400,
      }),
    );

    expect(error.kind).toBe('validation');
    expect(error.title).toBe('Filtro invalido');
    expect(error.message).toContain("El valor 'NOPE'");
    expect(error.retryable).toBe(false);
  });

  it('marca la tarea inexistente como no reintentable', () => {
    const error = toAppError(axiosErrorWithResponse(404, { title: 'Tarea no encontrada' }));

    expect(error.kind).toBe('notFound');
    expect(error.status).toBe(404);
    expect(error.retryable).toBe(false);
  });

  it('trata la base de datos caida como servicio no disponible y reintentable', () => {
    const error = toAppError(axiosErrorWithResponse(503, {}));

    expect(error.kind).toBe('unavailable');
    expect(error.retryable).toBe(true);
  });

  it('usa el mensaje de fallback cuando la respuesta no trae ProblemDetails', () => {
    const error = toAppError(axiosErrorWithResponse(500, 'texto plano'));

    expect(error.kind).toBe('server');
    expect(error.title).toBe('Error del servidor');
  });

  it('distingue la falta de conexion del timeout', () => {
    const config = { headers: new AxiosHeaders() };
    const network = new AxiosError('Network Error', 'ERR_NETWORK', config as never);
    const timeout = new AxiosError('timeout', 'ECONNABORTED', config as never);

    expect(toAppError(network).kind).toBe('network');
    expect(toAppError(timeout).kind).toBe('timeout');
  });

  it('devuelve un error generico ante algo que no viene de axios', () => {
    expect(toAppError(new Error('boom')).kind).toBe('unknown');
  });
});
