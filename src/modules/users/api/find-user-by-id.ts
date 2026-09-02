import 'server-only';
import { cache } from 'react';
import { serverApi } from '@/shared/api/server';
import type { UserAccountOutput } from '../types';

export const findUserById = cache((userId: string) =>
  serverApi.get<UserAccountOutput>(`/users/${userId}`),
);
