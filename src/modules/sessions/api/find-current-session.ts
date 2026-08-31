import 'server-only';
import { serverApi } from '@/shared/api/server';
import type { CurrentSessionOutput } from '../types';

export const findCurrentSession = () => serverApi.get<CurrentSessionOutput>('/sessions/current');
