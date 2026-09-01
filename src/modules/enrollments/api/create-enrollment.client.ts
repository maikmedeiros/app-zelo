'use client';

import { clientApi } from '@/shared/api/client';
import type { CreateEnrollmentInput } from '../schemas/create-enrollment';
import type { EnrollmentOutput } from '../types';

export const createEnrollment = (input: CreateEnrollmentInput) =>
  clientApi.post<EnrollmentOutput>('/enrollments', input);
