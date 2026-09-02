import 'server-only';
import { serverApi } from '@/shared/api/server';
import type { Paginated } from '@/shared/api/types';
import type { FindListTeachersParams } from '../schemas/find-list-teachers';
import type { TeacherOutput } from '../types';

export const findListTeachers = (params: Partial<FindListTeachersParams> = {}) =>
  serverApi.get<Paginated<TeacherOutput>>('/teachers', { params });
