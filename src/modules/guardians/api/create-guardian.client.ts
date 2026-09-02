'use client';

import { clientApi } from '@/shared/api/client';
import type { CreateGuardianInput } from '../schemas/guardian-form';
import type { GuardianOutput } from '../types';

export const createGuardian = (input: CreateGuardianInput) =>
  clientApi.post<GuardianOutput>('/guardians', input);
