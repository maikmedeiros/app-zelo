import 'server-only';
import { serverApi } from '@/shared/api/server';
import type { Paginated } from '@/shared/api/types';
import type { FindListGuardianLinksParams, GuardianLinkOutput } from '../types';

export const findListGuardianLinks = (params: FindListGuardianLinksParams = {}) =>
  serverApi.get<Paginated<GuardianLinkOutput>>('/guardian-links', { params });
