'use client';

import { clientApi } from '@/shared/api/client';
import type { UpdateTeacherInput } from '../schemas/teacher-form';
import type { TeacherOutput } from '../types';

export const updateTeacher = (teacherId: string, input: UpdateTeacherInput) =>
  clientApi.patch<TeacherOutput>(`/teachers/${teacherId}`, input);
