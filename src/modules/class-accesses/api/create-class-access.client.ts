'use client';

import { clientApi } from '@/shared/api/client';
import type { CreateClassAccessInput } from '../schemas/create-class-access';
import type { ClassAccessOutput } from '../types';

export const createClassAccess = (input: CreateClassAccessInput) =>
  clientApi.post<ClassAccessOutput>('/class-accesses', input);
