'use client';

import { clientApi } from '@/shared/api/client';
import type { MediaOutput } from '../types';

export const createMedia = (postId: string, file: File) => {
  const form = new FormData();
  form.append('file', file);

  return clientApi.post<MediaOutput>(`/posts/${postId}/media`, form);
};
