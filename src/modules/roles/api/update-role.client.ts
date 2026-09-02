'use client';

import { clientApi } from '@/shared/api/client';
import type { UpdateRoleInput } from '../schemas/role-form';
import type { RoleOutput } from '../types';

export const updateRole = (roleId: string, input: UpdateRoleInput) =>
  clientApi.patch<RoleOutput>(`/roles/${roleId}`, input);
