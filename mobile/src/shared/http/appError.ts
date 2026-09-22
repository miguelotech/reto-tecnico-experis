import axios from 'axios';

export type AppErrorKind =
  | 'network'
  | 'timeout'
  | 'canceled'
  | 'validation'
  | 'notFound'
  | 'unavailable'
  | 'server'
  | 'unknown';

export type AppError = {
  kind: AppErrorKind;
  title: string;
  message: string;
  status?: number;
  retryable: boolean;
};

type ProblemDetails = {
  title?: string;
  detail?: string;
  status?: number;
};

const FALLBACKS: Record<AppErrorKind, { title: string; message: string; retryable: boolean }> = {
  network: {
    title: 'Sin conexión con el servidor',
    message: 'No pudimos contactar a la API. Revisa que el backend esté levantado y vuelve a intentar.',
    retryable: true,
  },
  timeout: {
    title: 'El servidor tardó demasiado',
    message: 'La solicitud superó el tiempo de espera. Vuelve a intentar en unos segundos.',
    retryable: true,
  },
  canceled: {
    title: 'Solicitud cancelada',
    message: 'La solicitud se canceló antes de terminar.',
    retryable: true,
  },
  validation: {
    title: 'Filtro no válido',
    message: 'La combinación de filtros enviada no es válida.',
    retryable: false,
  },
  notFound: {
    title: 'No encontramos la tarea',
    message: 'La tarea que buscas ya no existe o el identificador es incorrecto.',
    retryable: false,
  },
  unavailable: {
    title: 'Servicio no disponible',
    message: 'La base de datos no está respondiendo. Intenta nuevamente en unos momentos.',
    retryable: true,
  },
  server: {
    title: 'Error del servidor',
    message: 'Ocurrió un error inesperado en el servidor. Intenta nuevamente.',
    retryable: true,
  },
  unknown: {
    title: 'Error inesperado',
    message: 'Ocurrió un error inesperado. Intenta nuevamente.',
    retryable: true,
  },
};

const kindFromStatus = (status: number): AppErrorKind => {
  if (status === 400 || status === 422) {
    return 'validation';
  }
  if (status === 404) {
    return 'notFound';
  }
  if (status === 503) {
    return 'unavailable';
  }
  if (status >= 500) {
    return 'server';
  }
  return 'unknown';
};

const buildError = (kind: AppErrorKind, problem?: ProblemDetails, status?: number): AppError => {
  const fallback = FALLBACKS[kind];

  return {
    kind,
    title: problem?.title?.trim() || fallback.title,
    message: problem?.detail?.trim() || fallback.message,
    status,
    retryable: fallback.retryable,
  };
};

export const toAppError = (error: unknown): AppError => {
  if (isAppError(error)) {
    return error;
  }

  if (axios.isCancel(error)) {
    return buildError('canceled');
  }

  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return buildError('timeout');
    }

    const response = error.response;
    if (!response) {
      return buildError('network');
    }

    const problem = typeof response.data === 'object' ? (response.data as ProblemDetails) : undefined;

    return buildError(kindFromStatus(response.status), problem, response.status);
  }

  return buildError('unknown');
};

export const isAppError = (value: unknown): value is AppError =>
  typeof value === 'object' &&
  value !== null &&
  'kind' in value &&
  'title' in value &&
  'retryable' in value;
