import { z } from 'zod';

export const createEnrollmentSchema = z.strictObject({
  studentId: z.guid('Escolha o aluno.'),
  classId: z.guid('Escolha a turma.'),
  startDate: z.iso.date('Informe uma data válida.').optional(),
});

export type CreateEnrollmentInput = z.infer<typeof createEnrollmentSchema>;
