import 'server-only';
import { serverApi } from '@/shared/api/server';
import type { Paginated } from '@/shared/api/types';
import type { FindListRolesParams } from '../schemas/find-list-roles';
import type { RoleOutput } from '../types';

export const findListRoles = (params: Partial<FindListRolesParams> = { limit: 100 }) =>
  serverApi.get<Paginated<RoleOutput>>('/roles', { params });
