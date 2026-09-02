import 'server-only';
import { cache } from 'react';
import { serverApi } from '@/shared/api/server';
import type { PersonOutput } from '../types';

export const findPersonById = cache((personId: string) =>
  serverApi.get<PersonOutput>(`/people/${personId}`),
);
