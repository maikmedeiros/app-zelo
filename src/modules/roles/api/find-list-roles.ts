import 'server-only';
import { serverApi } from '@/shared/api/server';
import type { Paginated } from '@/shared/api/types';
import type { RoleOutput } from '../types';

export const findListRoles = (params: { page?: number; limit?: number } = { limit: 100 }) =>
  serverApi.get<Paginated<RoleOutput>>('/roles', { params });
