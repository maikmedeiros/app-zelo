import 'server-only';
import { cache } from 'react';
import { serverApi } from '@/shared/api/server';
import type { ClassOutput } from '../types';

export const findClassById = cache((classId: string) =>
  serverApi.get<ClassOutput>(`/classes/${classId}`),
);
