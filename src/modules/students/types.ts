export const JOURNAL_ENTRY_STATUSES = [
  'PUBLICADA',
  'REMOVIDA_PELO_AUTOR',
  'REMOVIDA_PELA_ESCOLA',
] as const;

export type JournalEntryStatus = (typeof JOURNAL_ENTRY_STATUSES)[number];

export interface JournalEntryOutput {
  id: string;
  studentId: string;
  classId: string;
  className: string;
  authorId: string;
  authorPersonId: string;
  authorName: string;
  repliesToId: string | null;
  text: string | null;
  referenceDate: string;
  status: JournalEntryStatus;
  removalReason: string | null;
  removedAt: string | null;
  editedAt: string | null;
  createdAt: string;
}

export const isRemoved = (entry: JournalEntryOutput): boolean => entry.status !== 'PUBLICADA';

export interface StudentOutput {
  id: string;
  personId: string;
  personName: string;
  birthDate: string | null;
  code: string | null;
  notes: string | null;
  active: boolean;
  classId: string | null;
  className: string | null;
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

export interface ConsentOutput {
  id: string;
  studentId: string;
  type: ConsentType;
  granted: boolean;
  origin: ConsentOrigin;
  recordedById: string;
  recordedByName: string;
  guardianId: string | null;
  guardianName: string | null;
  documentKey: string | null;
  note: string | null;
  startedAt: string;
  endedAt: string | null;
  current: boolean;
  createdAt: string;
}
