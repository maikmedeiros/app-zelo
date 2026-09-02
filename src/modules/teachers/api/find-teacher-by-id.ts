import 'server-only';
import { cache } from 'react';
import { serverApi } from '@/shared/api/server';
import type { TeacherOutput } from '../types';

export const findTeacherById = cache((teacherId: string) =>
  serverApi.get<TeacherOutput>(`/teachers/${teacherId}`),
);
