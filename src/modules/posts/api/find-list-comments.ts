import 'server-only';
import { serverApi } from '@/shared/api/server';
import type { Paginated } from '@/shared/api/types';
import type { CommentOutput } from '../types';

export type FindListCommentsParams = { page?: number; limit?: number };

export const findListComments = (postId: string, params: FindListCommentsParams = {}) =>
  serverApi.get<Paginated<CommentOutput>>(`/posts/${postId}/comments`, { params });
