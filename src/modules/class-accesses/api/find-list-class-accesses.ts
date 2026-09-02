import 'server-only';
import { serverApi } from '@/shared/api/server';
import type { Paginated } from '@/shared/api/types';
import type { FindListClassAccessesParams } from '../schemas/find-list-class-accesses';
import type { ClassAccessOutput } from '../types';

export const findListClassAccesses = (params: Partial<FindListClassAccessesParams> = {}) =>
  serverApi.get<Paginated<ClassAccessOutput>>('/class-accesses', { params });
