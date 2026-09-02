import 'server-only';
import { serverApi } from '@/shared/api/server';
import type { Paginated } from '@/shared/api/types';
import type { FindListUsersParams } from '../schemas/find-list-users';
import type { UserAccountOutput } from '../types';

export const findListUsers = (params: Partial<FindListUsersParams> = {}) =>
  serverApi.get<Paginated<UserAccountOutput>>('/users', { params });
