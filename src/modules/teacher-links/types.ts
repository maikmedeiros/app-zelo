export const TEACHER_ROLES = ['TITULAR', 'AUXILIAR', 'VOLANTE'] as const;

export type TeacherRole = (typeof TEACHER_ROLES)[number];

export interface TeacherLinkOutput {
  id: string;
  teacherId: string;
  teacherName: string;
  classId: string;
  className: string;
  role: TeacherRole;
  startDate: string;
  endDate: string | null;
}

export type FindListTeacherLinksParams = {
  page?: number;
  limit?: number;
  teacherId?: string;
  classId?: string;
  active?: boolean;
};
