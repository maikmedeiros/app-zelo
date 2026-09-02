import 'server-only';
import { serverApi } from '@/shared/api/server';
import type { Paginated } from '@/shared/api/types';
import type { FindListGuardiansParams } from '../schemas/find-list-guardians';
import type { GuardianOutput } from '../types';

export const findListGuardians = (params: Partial<FindListGuardiansParams> = {}) =>
  serverApi.get<Paginated<GuardianOutput>>('/guardians', { params });
