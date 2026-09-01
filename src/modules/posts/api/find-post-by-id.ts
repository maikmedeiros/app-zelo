import 'server-only';
import { serverApi } from '@/shared/api/server';
import type { PostOutput } from '../types';

export const findPostById = (postId: string) => serverApi.get<PostOutput>(`/posts/${postId}`);
