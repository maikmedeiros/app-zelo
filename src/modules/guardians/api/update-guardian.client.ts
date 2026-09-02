'use client';

import { clientApi } from '@/shared/api/client';
import type { UpdateGuardianInput } from '../schemas/guardian-form';
import type { GuardianOutput } from '../types';

export const updateGuardian = (guardianId: string, input: UpdateGuardianInput) =>
  clientApi.patch<GuardianOutput>(`/guardians/${guardianId}`, input);
