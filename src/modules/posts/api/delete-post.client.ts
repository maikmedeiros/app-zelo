'use client';

import { clientApi } from '@/shared/api/client';

export const deletePost = (postId: string) => clientApi.delete(`/posts/${postId}`);
