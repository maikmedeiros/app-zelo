import { NextResponse, type NextRequest } from 'next/server';
import { serverEnv } from '@/config/env.server';
import { PATHNAME_HEADER } from '@/shared/api/server';

const PUBLIC_PATHS = ['/login'];

const isPublic = (pathname: string): boolean =>
  PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

export function proxy(request: NextRequest): NextResponse {
  const { pathname, search } = request.nextUrl;
  const current = `${pathname}${search}`;

  if (!request.cookies.has(serverEnv.sessionCookieName) && !isPublic(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.search = '';
    url.searchParams.set('next', current);

    return NextResponse.redirect(url);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(PATHNAME_HEADER, current);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|ico)$).*)',
  ],
};
