import 'server-only';
import { cache } from 'react';
import { serverApi } from '@/shared/api/server';
import type { GuardianOutput } from '../types';

export const findGuardianById = cache((guardianId: string) =>
  serverApi.get<GuardianOutput>(`/guardians/${guardianId}`),
);
