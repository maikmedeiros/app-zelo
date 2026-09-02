'use client';

import { clientApi } from '@/shared/api/client';
import type { UpdateSchoolYearInput } from '../schemas/school-year-form';
import type { SchoolYearOutput } from '../types';

export const updateSchoolYear = (schoolYearId: string, input: UpdateSchoolYearInput) =>
  clientApi.patch<SchoolYearOutput>(`/school-years/${schoolYearId}`, input);
