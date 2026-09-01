'use client';

import { clientApi } from '@/shared/api/client';
import type { UpdatePostInput } from '../schemas/update-post';
import type { PostOutput } from '../types';

export const updatePost = (postId: string, input: UpdatePostInput) =>
  clientApi.patch<PostOutput>(`/posts/${postId}`, input);
