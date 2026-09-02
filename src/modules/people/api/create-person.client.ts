'use client';

import { clientApi } from '@/shared/api/client';
import type { CreatePersonInput } from '../schemas/person-form';
import type { PersonOutput } from '../types';

export const createPerson = (input: CreatePersonInput) =>
  clientApi.post<PersonOutput>('/people', input);
