import type { Feature } from '@/config/features';
import { SCOPES, type Scope, type Session } from './session';

export const scopesOf = (session: Session, feature: Feature): Scope[] =>
  SCOPES.filter((scope) => session.permissions.includes(`${feature}:${scope}`));

export const hasCapability = (session: Session, feature: Feature): boolean =>
  scopesOf(session, feature).length > 0;

export const widestScope = (session: Session, feature: Feature): Scope | null =>
  scopesOf(session, feature).at(-1) ?? null;

export const isInClass = (session: Session, classId: string): boolean =>
  session.classes.includes(classId);
