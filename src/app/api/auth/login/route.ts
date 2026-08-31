import type { NextRequest } from 'next/server';
import { createSessionSchema } from '@/modules/sessions/schemas/create-session';
import { apiRequest } from '@/shared/api/server';

export async function POST(request: NextRequest): Promise<Response> {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    payload = null;
  }

  const parsed = createSessionSchema.safeParse(payload);

  if (!parsed.success) {
    return Response.json(
      {
        error: 'ValidationError',
        message: 'Dados de entrada inválidos',
        cause: parsed.error.issues,
      },
      { status: 400 },
    );
  }

  const upstream = await apiRequest('POST', '/sessions', { body: parsed.data });
  const body = await upstream.text();

  const response = new Response(body.length > 0 ? body : null, {
    status: upstream.status,
    headers: {
      'content-type': upstream.headers.get('content-type') ?? 'application/json',
      'cache-control': 'private, no-store',
    },
  });

  for (const cookie of upstream.headers.getSetCookie()) {
    response.headers.append('set-cookie', cookie);
  }

  return response;
}
