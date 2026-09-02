import 'server-only';
import { serverApi } from '@/shared/api/server';
import type { RoleOutput } from '../types';

export const findRoleById = (roleId: string) => serverApi.get<RoleOutput>(`/roles/${roleId}`);
