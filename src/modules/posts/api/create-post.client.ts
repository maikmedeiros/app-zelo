'use client';

import { clientApi } from '@/shared/api/client';
import type { CreatePostInput } from '../schemas/create-post';
import type { PostOutput } from '../types';

export const createPost = (input: CreatePostInput) => clientApi.post<PostOutput>('/posts', input);
