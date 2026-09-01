'use client';

import { clientApi } from '@/shared/api/client';

export const deleteMedia = (postId: string, mediaId: string) =>
  clientApi.delete(`/posts/${postId}/media/${mediaId}`);
