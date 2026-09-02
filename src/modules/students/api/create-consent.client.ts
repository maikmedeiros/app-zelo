'use client';

import { clientApi } from '@/shared/api/client';
import type { CreateConsentInput } from '../schemas/consents';
import type { ConsentOutput } from '../types';

export const createConsent = (studentId: string, input: CreateConsentInput) =>
  clientApi.post<ConsentOutput>(`/students/${studentId}/consents`, input);
