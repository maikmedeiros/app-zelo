import 'server-only';
import { serverApi } from '@/shared/api/server';
import type { Paginated } from '@/shared/api/types';
import type { FindListSchoolYearsParams, SchoolYearOutput } from '../types';

export const findListSchoolYears = (params: FindListSchoolYearsParams = { limit: 100 }) =>
  serverApi.get<Paginated<SchoolYearOutput>>('/school-years', { params });
