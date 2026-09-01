import 'server-only';
import { serverApi } from '@/shared/api/server';
import type { StudentOutput } from '../types';

export const findStudentById = (studentId: string) =>
  serverApi.get<StudentOutput>(`/students/${studentId}`);
