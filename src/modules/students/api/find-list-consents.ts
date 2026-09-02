import 'server-only';
import { serverApi } from '@/shared/api/server';
import type { Paginated } from '@/shared/api/types';
import type { FindListConsentsParams } from '../schemas/consents';
import type { ConsentOutput } from '../types';

export const findListConsents = (studentId: string, params: Partial<FindListConsentsParams> = {}) =>
  serverApi.get<Paginated<ConsentOutput>>(`/students/${studentId}/consents`, { params });
