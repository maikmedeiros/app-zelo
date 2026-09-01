import 'server-only';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { serverEnv } from '@/config/env.server';
import { ApiError, networkError } from './errors';
import { toQueryString } from './query-string';
import type { ApiErrorBody, HttpMethod, RequestOptions } from './types';

export const PATHNAME_HEADER = 'x-zelo-pathname';

const FORBIDDEN_PATH = '/403';

interface ServerRequestOptions extends RequestOptions {
  body?: unknown;
}

const buildHeaders = async (options: ServerRequestOptions, hasBody: boolean): Promise<Headers> => {
  const requestHeaders = new Headers(options.headers);

  requestHeaders.set('accept', 'application/json');
  if (hasBody) requestHeaders.set('content-type', 'application/json');

  const token = (await cookies()).get(serverEnv.sessionCookieName)?.value;
  if (token !== undefined) requestHeaders.set('cookie', `${serverEnv.sessionCookieName}=${token}`);

  return requestHeaders;
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

const loginPath = async (): Promise<string> => {
  const from = (await headers()).get(PATHNAME_HEADER);
  return from === null || from === '/login' ? '/login' : `/login?next=${encodeURIComponent(from)}`;
};

export const apiRequest = async (
  method: HttpMethod,
  path: string,
  options: ServerRequestOptions = {},
): Promise<Response> => {
  const hasBody = options.body !== undefined;
  const url = `${serverEnv.apiUrl}${path}${toQueryString(options.params)}`;

  try {
    return await fetch(url, {
      method,
      headers: await buildHeaders(options, hasBody),
      body: hasBody ? JSON.stringify(options.body) : undefined,
      cache: 'no-store',
      signal: options.signal,
    });
  } catch (cause) {
    throw networkError(cause);
  }
};

const request = async <T>(
  method: HttpMethod,
  path: string,
  options: ServerRequestOptions = {},
): Promise<T> => {
  const response = await apiRequest(method, path, options);

  if (response.status === 401) redirect(await loginPath());
  if (response.status === 403) redirect(FORBIDDEN_PATH);

  if (!response.ok) throw new ApiError(response.status, await readErrorBody(response));

  return readBody<T>(response);
};

export const serverApi = {
  get: <T>(path: string, options?: RequestOptions) => request<T>('GET', path, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('POST', path, { ...options, body: body ?? {} }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PUT', path, { ...options, body: body ?? {} }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>('PATCH', path, { ...options, body: body ?? {} }),
  delete: <T = void>(path: string, options?: RequestOptions & { body?: unknown }) =>
    request<T>('DELETE', path, options),
};
