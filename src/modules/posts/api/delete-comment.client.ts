'use client';

import { clientApi } from '@/shared/api/client';
import type { DeleteCommentInput } from '../schemas/comments';

export const deleteComment = (postId: string, commentId: string, input: DeleteCommentInput = {}) =>
  clientApi.delete(`/posts/${postId}/comments/${commentId}`, { body: input });
