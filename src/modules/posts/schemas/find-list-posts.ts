import { z } from 'zod';
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

export const parseFeedSearchParams = (
  searchParams: Record<string, string | string[] | undefined>,
): FindListPostsParams => {
  const first = (value: string | string[] | undefined): string | undefined =>
    Array.isArray(value) ? value[0] : value;

  const candidate = {
    page: first(searchParams.page),
    limit: first(searchParams.limit),
    classId: first(searchParams.classId),
    studentId: first(searchParams.studentId),
    authorId: first(searchParams.authorId),
    status: first(searchParams.status),
    type: first(searchParams.type),
  };

  const cleaned = Object.fromEntries(
    Object.entries(candidate).filter(([, value]) => value !== undefined && value !== ''),
  );

  const parsed = findListPostsSchema.safeParse(cleaned);

  return parsed.success ? parsed.data : findListPostsSchema.parse({});
};
