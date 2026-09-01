'use client';

import { clientApi } from '@/shared/api/client';
import type { PostOutput } from '../types';

export const publishPost = (postId: string) =>
  clientApi.post<PostOutput>(`/posts/${postId}/publication`);
