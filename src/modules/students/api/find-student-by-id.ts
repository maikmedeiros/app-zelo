import 'server-only';
import { cache } from 'react';
import { serverApi } from '@/shared/api/server';
import type { StudentOutput } from '../types';

export const findStudentById = cache((studentId: string) =>
  serverApi.get<StudentOutput>(`/students/${studentId}`),
);
