'use client';

import { clientApi } from '@/shared/api/client';
import type { CreateClassInput } from '../schemas/class-form';
import type { ClassOutput } from '../types';

export const createClass = (input: CreateClassInput) =>
  clientApi.post<ClassOutput>('/classes', input);
