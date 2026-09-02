import 'server-only';
import { serverApi } from '@/shared/api/server';
import type { Paginated } from '@/shared/api/types';
import type { FindListRoleGrantsParams } from '../schemas/find-list-role-grants';
import type { RoleGrantOutput } from '../types';

export const findListRoleGrants = (params: Partial<FindListRoleGrantsParams> = {}) =>
  serverApi.get<Paginated<RoleGrantOutput>>('/role-grants', { params });
