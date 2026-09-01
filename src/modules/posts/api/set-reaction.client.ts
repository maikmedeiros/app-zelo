'use client';

import { clientApi } from '@/shared/api/client';
import type { ReactionSummaryOutput } from '../types';

export const setReaction = (postId: string, code: string) =>
  clientApi.put<ReactionSummaryOutput>(`/posts/${postId}/reactions`, { code });

export const deleteReaction = (postId: string) => clientApi.delete(`/posts/${postId}/reactions`);
