import { cookies } from 'next/headers';
import { serverEnv } from '@/config/env.server';
import { apiRequest } from '@/shared/api/server';

export async function POST(): Promise<Response> {
  const upstream = await apiRequest('DELETE', '/sessions/current');
  const setCookies = upstream.headers.getSetCookie();

  const response = new Response(null, {
    status: 204,
    headers: { 'cache-control': 'private, no-store' },
  });

  if (setCookies.length === 0) {
    (await cookies()).delete(serverEnv.sessionCookieName);
    return response;
  }

  for (const cookie of setCookies) response.headers.append('set-cookie', cookie);

  return response;
}
