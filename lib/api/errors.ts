import type { ApiErrorBody } from './types';

export type ApiErrorOptions = {
  status?: number;
  success?: boolean;
  body?: ApiErrorBody;
};

export class ApiError extends Error {
  readonly status: number;
  readonly success?: boolean;
  readonly body?: ApiErrorBody;

  constructor(message: string, options: ApiErrorOptions = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status ?? 0;
    this.success = options.success;
    this.body = options.body;
  }
}
