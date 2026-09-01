import 'server-only';
import { serverApi } from '@/shared/api/server';
import type { Paginated } from '@/shared/api/types';
import type { FindListPostsParams } from '../schemas/find-list-posts';
import type { PostOutput } from '../types';

export const findListPosts = (params: FindListPostsParams) =>
  serverApi.get<Paginated<PostOutput>>('/posts', { params });
