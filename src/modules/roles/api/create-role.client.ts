'use client';

import { clientApi } from '@/shared/api/client';
import type { CreateRoleInput } from '../schemas/role-form';
import type { RoleOutput } from '../types';

export const createRole = (input: CreateRoleInput) => clientApi.post<RoleOutput>('/roles', input);
