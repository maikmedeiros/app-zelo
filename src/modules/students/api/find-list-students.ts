import 'server-only';
import { serverApi } from '@/shared/api/server';
import type { Paginated } from '@/shared/api/types';
import type { FindListStudentsParams } from '../schemas/find-list-students';
import type { StudentOutput } from '../types';

export const findListStudents = (params: Partial<FindListStudentsParams> = {}) =>
  serverApi.get<Paginated<StudentOutput>>('/students', { params });
