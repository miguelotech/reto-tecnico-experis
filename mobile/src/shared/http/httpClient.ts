import axios from 'axios';
import { env } from '../../config/env';
import { toAppError } from './appError';

export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.requestTimeoutMs,
  headers: {
    Accept: 'application/json',
  },
});

httpClient.interceptors.response.use(
  response => response,
  error => Promise.reject(toAppError(error)),
);
