import 'server-only';
import { serverApi } from '@/shared/api/server';
import type { Collection } from '@/shared/api/types';
import type { MediaOutput } from '../types';

export const findListMedia = (postId: string) =>
  serverApi.get<Collection<MediaOutput>>(`/posts/${postId}/media`);
