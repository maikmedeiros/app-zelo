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
