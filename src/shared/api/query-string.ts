import type { QueryParamValue, QueryParams } from './types';

const serialize = (value: Exclude<QueryParamValue, null | undefined>): string =>
  value instanceof Date ? value.toISOString() : String(value);

export const toQueryString = (params?: QueryParams): string => {
  if (!params) return '';

  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      for (const item of value) {
        if (item === undefined || item === null) continue;
        search.append(key, serialize(item));
      }
      continue;
    }

    search.append(key, serialize(value as Exclude<QueryParamValue, null | undefined>));
  }

  const query = search.toString();
  return query.length > 0 ? `?${query}` : '';
};
