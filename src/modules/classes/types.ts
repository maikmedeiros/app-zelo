import type { ConsentOrigin, ConsentType } from '@/modules/students/types';

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
