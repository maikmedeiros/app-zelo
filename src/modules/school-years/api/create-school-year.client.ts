'use client';

import { clientApi } from '@/shared/api/client';
import type { CreateSchoolYearInput } from '../schemas/school-year-form';
import type { SchoolYearOutput } from '../types';

export const createSchoolYear = (input: CreateSchoolYearInput) =>
  clientApi.post<SchoolYearOutput>('/school-years', input);
