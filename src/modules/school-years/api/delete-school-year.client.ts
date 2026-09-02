'use client';

import { clientApi } from '@/shared/api/client';

export const deleteSchoolYear = (schoolYearId: string) =>
  clientApi.delete(`/school-years/${schoolYearId}`);
