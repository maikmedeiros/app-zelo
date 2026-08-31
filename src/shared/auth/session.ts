import type { CurrentSessionOutput } from '@/modules/sessions/types';

export type Session = CurrentSessionOutput;

export const SCOPES = ['PROPRIA', 'TURMA', 'ESCOLA'] as const;

export type Scope = (typeof SCOPES)[number];
