'use client';

import { clientApi } from '@/shared/api/client';
import type { CreateCommentInput } from '../schemas/comments';
import type { CommentOutput } from '../types';

export const createComment = (postId: string, input: CreateCommentInput) =>
  clientApi.post<CommentOutput>(`/posts/${postId}/comments`, input);
