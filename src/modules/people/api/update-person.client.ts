'use client';

import { clientApi } from '@/shared/api/client';
import type { UpdatePersonInput } from '../schemas/person-form';
import type { PersonOutput } from '../types';

export const updatePerson = (personId: string, input: UpdatePersonInput) =>
  clientApi.patch<PersonOutput>(`/people/${personId}`, input);
