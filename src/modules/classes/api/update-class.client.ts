'use client';

import { clientApi } from '@/shared/api/client';
import type { UpdateClassInput } from '../schemas/class-form';
import type { ClassOutput } from '../types';

export const updateClass = (classId: string, input: UpdateClassInput) =>
  clientApi.patch<ClassOutput>(`/classes/${classId}`, input);
