import 'server-only';
import { serverApi } from '@/shared/api/server';
import type { Paginated } from '@/shared/api/types';
import type { FindListClassesParams } from '../schemas/find-list-classes';
import type { ClassOutput } from '../types';

export const findListClasses = (params: Partial<FindListClassesParams> = {}) =>
  serverApi.get<Paginated<ClassOutput>>('/classes', { params });
