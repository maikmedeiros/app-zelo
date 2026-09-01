import 'server-only';
import { serverApi } from '@/shared/api/server';
import type { Paginated } from '@/shared/api/types';
import type { FindListStudentsParams, StudentOutput } from '../types';

export const findListStudents = (params: FindListStudentsParams = {}) =>
  serverApi.get<Paginated<StudentOutput>>('/students', { params });
