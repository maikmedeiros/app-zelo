'use client';

import { clientApi } from '@/shared/api/client';
import type { CreateUserInput } from '../schemas/user-form';
import type { UserAccountOutput } from '../types';

export const createUser = (input: CreateUserInput) =>
  clientApi.post<UserAccountOutput>('/users', input);
