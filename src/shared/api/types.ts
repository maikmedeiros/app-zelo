export interface Pagination {
  page: number;
  limit: number;
  totalResults: number;
  totalPages: number;
}

export interface Paginated<T> extends Pagination {
  results: T[];
}

export interface Collection<T> {
  results: T[];
}

export interface ValidationIssue {
  code?: string;
  path: (string | number)[];
  message: string;
}

export interface ApiErrorBody {
  error: string;
  message: string;
  cause?: unknown;
  stack?: string;
}

export type QueryParamValue = string | number | boolean | Date | null | undefined;

export type QueryParams = Record<string, QueryParamValue | readonly QueryParamValue[]>;

export interface RequestOptions {
  params?: QueryParams;
  headers?: HeadersInit;
  signal?: AbortSignal;
}

export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;

export type HttpMethod = (typeof HTTP_METHODS)[number];
