import 'server-only';
import { cache } from 'react';
import { findCurrentSession } from '@/modules/sessions/api/find-current-session';
import type { Session } from './session';

export const getCurrentSession = cache((): Promise<Session> => findCurrentSession());
