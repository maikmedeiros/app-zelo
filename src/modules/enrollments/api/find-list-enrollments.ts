import 'server-only';
import { serverApi } from '@/shared/api/server';
import type { Paginated } from '@/shared/api/types';
import type { FindListEnrollmentsParams } from '../schemas/find-list-enrollments';
import type { EnrollmentOutput } from '../types';

export const findListEnrollments = (params: Partial<FindListEnrollmentsParams> = {}) =>
  serverApi.get<Paginated<EnrollmentOutput>>('/enrollments', { params });
