import type { NextRequest } from 'next/server';
import { forwardToApi } from '@/shared/api/proxy';

const handler = async (
  request: NextRequest,
  context: RouteContext<'/api/v1/[...path]'>,
): Promise<Response> => {
  const { path } = await context.params;
  return forwardToApi(request, path);
};

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
