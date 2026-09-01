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
