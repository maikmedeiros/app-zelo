export interface EnrollmentOutput {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  startDate: string;
  endDate: string | null;
}

export const isCurrent = (enrollment: EnrollmentOutput): boolean => enrollment.endDate === null;
