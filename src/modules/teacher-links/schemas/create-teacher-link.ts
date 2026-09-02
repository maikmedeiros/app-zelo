import { z } from 'zod';
import { TEACHER_ROLES } from '../types';

export const createTeacherLinkSchema = z.strictObject({
  teacherId: z.guid('Escolha o professor.'),
  classId: z.guid('Escolha a turma.'),
  role: z.enum(TEACHER_ROLES).default('TITULAR'),
  startDate: z.iso.date('Informe uma data válida.').optional(),
});

export type CreateTeacherLinkInput = z.infer<typeof createTeacherLinkSchema>;
