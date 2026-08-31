import 'server-only';
import type { NextRequest } from 'next/server';
import { serverEnv } from '@/config/env.server';
import { resolveApiPath } from './allowed-paths';

const FORWARDED_REQUEST_HEADERS = ['accept', 'accept-language', 'content-type', 'cookie'];

const FORWARDED_RESPONSE_HEADERS = [
  'content-type',
  'content-length',
  'content-disposition',
  'etag',
];

const json = (status: number, error: string, message: string): Response =>
  Response.json({ error, message }, { status });

const buildRequestHeaders = (request: NextRequest): Headers => {
  const headers = new Headers();

  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value !== null) headers.set(name, value);
  }

  return headers;
};

const buildResponseHeaders = (upstream: Response): Headers => {
  const headers = new Headers();

  for (const name of FORWARDED_RESPONSE_HEADERS) {
    const value = upstream.headers.get(name);
    if (value !== null) headers.set(name, value);
  }

  const cacheControl = upstream.headers.get('cache-control');
  headers.set(
    'cache-control',
    cacheControl !== null && !cacheControl.includes('public') ? cacheControl : 'private, no-store',
  );

  for (const cookie of upstream.headers.getSetCookie()) headers.append('set-cookie', cookie);

  return headers;
};

export const forwardToApi = async (request: NextRequest, segments: string[]): Promise<Response> => {
  const apiPath = resolveApiPath(segments);

  if (apiPath === null) return json(404, 'NotFoundError', 'Recurso não encontrado');

  const url = `${serverEnv.apiUrl}${apiPath}${request.nextUrl.search}`;
  const hasBody = request.method !== 'GET' && request.body !== null;

  let upstream: Response;

  try {
    upstream = await fetch(url, {
      method: request.method,
      headers: buildRequestHeaders(request),
      body: hasBody ? request.body : null,
      redirect: 'manual',
      cache: 'no-store',
      ...(hasBody ? { duplex: 'half' } : {}),
    } as RequestInit);
  } catch {
    return json(502, 'ServiceError', 'Não foi possível falar com o servidor. Tente novamente.');
  }

  const body = upstream.status === 204 || upstream.status === 205 ? null : upstream.body;

  return new Response(body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: buildResponseHeaders(upstream),
  });
};
