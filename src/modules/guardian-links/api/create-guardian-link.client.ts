'use client';

import { clientApi } from '@/shared/api/client';
import type { CreateGuardianLinkInput } from '../schemas/guardian-link-form';
import type { GuardianLinkOutput } from '../types';

export const createGuardianLink = (input: CreateGuardianLinkInput) =>
  clientApi.post<GuardianLinkOutput>('/guardian-links', input);
