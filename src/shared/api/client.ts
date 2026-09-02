import 'client-only';
import { ApiError, networkError, offlineError } from './errors';
import { toQueryString } from './query-string';
import type { ApiErrorBody, HttpMethod, RequestOptions } from './types';

const MUTATIONS = new Set<HttpMethod>(['POST', 'PUT', 'PATCH', 'DELETE']);

const BFF_PREFIX = '/api/v1';
const AUTH_PREFIX = '/api/auth';

interface ClientRequestOptions extends RequestOptions {
  body?: unknown;
  redirectOnUnauthorized?: boolean;
}

let redirecting = false;

const goToLogin = (): void => {
  if (redirecting) return;
  redirecting = true;

  const next = `${window.location.pathname}${window.location.search}`;
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.assign(`/login?next=${encodeURIComponent(next)}`);
};

const buildHeaders = (options: ClientRequestOptions, isJsonBody: boolean): Headers => {
  const headers = new Headers(options.headers);

  headers.set('accept', 'application/json');
  if (isJsonBody) headers.set('content-type', 'application/json');

  return headers;
};

const readErrorBody = async (response: Response): Promise<ApiErrorBody> => {
  const fallback: ApiErrorBody = {
    error: 'InternalServerError',
    message: `A API respondeu ${response.status}.`,
  };

  try {
    const body: unknown = await response.json();
    if (typeof body !== 'object' || body === null) return fallback;

    const { error, message, cause } = body as Partial<ApiErrorBody>;
    return {
      error: error ?? fallback.error,
      message: message ?? fallback.message,
      cause,
    };
  } catch {
    return fallback;
  }
};

const readBody = async <T>(response: Response): Promise<T> => {
  if (response.status === 204 || response.status === 205) return undefined as T;

  const text = await response.text();
  return text.length === 0 ? (undefined as T) : (JSON.parse(text) as T);
};

const request = async <T>(
  method: HttpMethod,
  url: string,
  options: ClientRequestOptions = {},
): Promise<T> => {
  if (MUTATIONS.has(method) && !navigator.onLine) throw offlineError();

  const hasBody = options.body !== undefined;
  const isFormData = options.body instanceof FormData;

  let response: Response;

  try {
    response = await fetch(`${url}${toQueryString(options.params)}`, {
      method,
      headers: buildHeaders(options, hasBody && !isFormData),
      body: isFormData ? (options.body as FormData) : hasBody ? JSON.stringify(options.body) : null,
      credentials: 'same-origin',
      cache: 'no-store',
      signal: options.signal,
    });
  } catch (cause) {
    throw networkError(cause);
  }

  if (response.status === 401 && options.redirectOnUnauthorized !== false) goToLogin();

  if (!response.ok) throw new ApiError(response.status, await readErrorBody(response));

  return readBody<T>(response);
};

export const clientApi = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>('GET', `${BFF_PREFIX}${path}`, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('POST', `${BFF_PREFIX}${path}`, { ...options, body: body ?? {} }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PUT', `${BFF_PREFIX}${path}`, { ...options, body: body ?? {} }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PATCH', `${BFF_PREFIX}${path}`, { ...options, body: body ?? {} }),
  delete: <T = void>(path: string, options?: RequestOptions & { body?: unknown }) =>
    request<T>('DELETE', `${BFF_PREFIX}${path}`, options),
};

export const authApi = {
  login: <T>(body: unknown) =>
    request<T>('POST', `${AUTH_PREFIX}/login`, { body, redirectOnUnauthorized: false }),
  logout: () =>
    request<void>('POST', `${AUTH_PREFIX}/logout`, { redirectOnUnauthorized: false, body: {} }),
};
