import 'server-only';
import { serverApi } from '@/shared/api/server';
import type { Paginated } from '@/shared/api/types';
import type { StudentConsentStatusOutput } from '../types';

export type FindListClassConsentsParams = {
  page?: number;
  limit?: number;
};

export const findListClassConsents = (classId: string, params: FindListClassConsentsParams = {}) =>
  serverApi.get<Paginated<StudentConsentStatusOutput>>(`/classes/${classId}/consents`, { params });
