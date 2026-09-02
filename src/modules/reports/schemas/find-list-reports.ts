import { z } from 'zod';
import { REPORT_STATUSES } from '../types';

export const findListReportsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  studentId: z.guid().optional(),
  classId: z.guid().optional(),
  status: z.enum(REPORT_STATUSES).optional(),
});

export type FindListReportsParams = z.infer<typeof findListReportsSchema>;
