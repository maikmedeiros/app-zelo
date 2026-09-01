import { z } from 'zod';
import { parseSearchParams, type RawSearchParams } from '@/shared/api/search-params';
import { POST_QUERYABLE_STATUSES, POST_TYPES } from '../types';

export const findListPostsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  classId: z.guid().optional(),
  studentId: z.guid().optional(),
  authorId: z.guid().optional(),
  status: z.enum(POST_QUERYABLE_STATUSES).default('PUBLICADA'),
  type: z.enum(POST_TYPES).optional(),
});

export type FindListPostsParams = z.infer<typeof findListPostsSchema>;

export const parseFeedSearchParams = (raw: RawSearchParams): FindListPostsParams =>
  parseSearchParams(findListPostsSchema, raw);
