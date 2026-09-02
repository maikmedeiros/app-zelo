import 'server-only';
import { serverApi } from '@/shared/api/server';
import type { Paginated } from '@/shared/api/types';
import type { FindListGuardianLinksParams } from '../schemas/find-list-guardian-links';
import type { GuardianLinkOutput } from '../types';

export const findListGuardianLinks = (params: Partial<FindListGuardianLinksParams> = {}) =>
  serverApi.get<Paginated<GuardianLinkOutput>>('/guardian-links', { params });
