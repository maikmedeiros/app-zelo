'use client';

import { clientApi } from '@/shared/api/client';
import type { UpdateUserInput } from '../schemas/user-form';
import type { UserAccountOutput } from '../types';

export const updateUser = (userId: string, input: UpdateUserInput) =>
  clientApi.patch<UserAccountOutput>(`/users/${userId}`, input);
