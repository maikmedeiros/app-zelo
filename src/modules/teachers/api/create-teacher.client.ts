'use client';

import { clientApi } from '@/shared/api/client';
import type { CreateTeacherInput } from '../schemas/teacher-form';
import type { TeacherOutput } from '../types';

export const createTeacher = (input: CreateTeacherInput) =>
  clientApi.post<TeacherOutput>('/teachers', input);
