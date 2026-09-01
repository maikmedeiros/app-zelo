'use client';

import { clientApi } from '@/shared/api/client';
import type { CreateStudentInput } from '../schemas/student-form';
import type { StudentOutput } from '../types';

export const createStudent = (input: CreateStudentInput) =>
  clientApi.post<StudentOutput>('/students', input);
