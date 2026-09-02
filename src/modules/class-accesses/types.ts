export const ACCESS_REASONS = [
  'COORDENACAO',
  'DIRECAO',
  'SECRETARIA',
  'SUBSTITUICAO',
  'ESTAGIO',
  'OUTRO',
] as const;

export type AccessReason = (typeof ACCESS_REASONS)[number];

export interface ClassAccessOutput {
  id: string;
  userId: string;
  userName: string;
  classId: string;
  className: string;
  reason: AccessReason;
  justification: string | null;
  grantedById: string;
  grantedByName: string;
  startDate: string;
  endDate: string | null;
}

export const isCurrent = (access: ClassAccessOutput): boolean => access.endDate === null;
