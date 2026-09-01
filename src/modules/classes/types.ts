export const CLASS_SHIFTS = ['MANHA', 'TARDE', 'INTEGRAL'] as const;

export type ClassShift = (typeof CLASS_SHIFTS)[number];

export interface ClassOutput {
  id: string;
  name: string;
  segment: string;
  shift: ClassShift;
  schoolYearId: string;
  schoolYear: number;
  studentCount: number;
}

export const CONSENT_TYPES = ['IMAGEM_INTERNA', 'IMAGEM_EXTERNA', 'TRATAMENTO_BIOMETRICO'] as const;

export type ConsentType = (typeof CONSENT_TYPES)[number];

export const CONSENT_ORIGINS = [
  'TERMO_MATRICULA',
  'PORTAL_RESPONSAVEL',
  'IMPORTACAO',
  'SOLICITACAO_VERBAL',
] as const;

export type ConsentOrigin = (typeof CONSENT_ORIGINS)[number];

export interface ConsentStateOutput {
  type: ConsentType;
  consentId: string | null;
  granted: boolean | null;
  origin: ConsentOrigin | null;
  startedAt: string | null;
}

export interface StudentConsentStatusOutput {
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  consents: ConsentStateOutput[];
}
