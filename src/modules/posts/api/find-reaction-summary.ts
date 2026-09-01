import 'server-only';
import { serverApi } from '@/shared/api/server';
import type { ReactionSummaryOutput } from '../types';

export const findReactionSummary = (postId: string) =>
  serverApi.get<ReactionSummaryOutput>(`/posts/${postId}/reactions`);
