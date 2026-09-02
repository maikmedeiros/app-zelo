import type { ApiErrorBody, ValidationIssue } from './types';

export class ApiError extends Error {
  readonly statusCode: number;
  readonly error: string;

  constructor(statusCode: number, body: ApiErrorBody) {
    super(body.message, { cause: body.cause });
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.error = body.error;
  }
}

export const isApiError = (value: unknown): value is ApiError => value instanceof ApiError;

const isValidationIssue = (value: unknown): value is ValidationIssue => {
  if (typeof value !== 'object' || value === null) return false;
  const issue = value as Record<string, unknown>;
  return Array.isArray(issue.path) && typeof issue.message === 'string';
};

export const fieldErrorsFrom = (cause: unknown): Record<string, string> => {
  if (!Array.isArray(cause)) return {};

  const errors: Record<string, string> = {};

  for (const issue of cause) {
    if (!isValidationIssue(issue)) continue;

    const field = issue.path.join('.');
    if (field.length === 0 || field in errors) continue;

    errors[field] = issue.message;
  }

  return errors;
};

export const networkError = (cause: unknown): ApiError =>
  new ApiError(502, {
    error: 'ServiceError',
    message: 'Não foi possível falar com o servidor. Tente novamente.',
    cause,
  });

export const offlineError = (): ApiError =>
  new ApiError(503, {
    error: 'OfflineError',
    message: 'Sem conexão. Nada foi enviado — tente de novo quando a internet voltar.',
  });
