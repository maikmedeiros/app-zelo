'use client';

import { clientApi } from '@/shared/api/client';
import type { UpdateGuardianLinkInput } from '../schemas/guardian-link-form';
import type { GuardianLinkOutput } from '../types';

export const updateGuardianLink = (linkId: string, input: UpdateGuardianLinkInput) =>
  clientApi.patch<GuardianLinkOutput>(`/guardian-links/${linkId}`, input);
