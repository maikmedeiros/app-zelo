'use client';

import { clientApi } from '@/shared/api/client';
import type { CreateRoleGrantInput } from '../schemas/role-grant-form';
import type { RoleGrantOutput } from '../types';

export const createRoleGrant = (input: CreateRoleGrantInput) =>
  clientApi.post<RoleGrantOutput>('/role-grants', input);
