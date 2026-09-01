'use client';

import { clientApi } from '@/shared/api/client';
import type { UpdateStudentInput } from '../schemas/student-form';
import type { StudentOutput } from '../types';

export const updateStudent = (studentId: string, input: UpdateStudentInput) =>
  clientApi.patch<StudentOutput>(`/students/${studentId}`, input);
