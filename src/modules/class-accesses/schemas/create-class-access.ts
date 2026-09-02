import { z } from 'zod';
import { ACCESS_REASONS } from '../types';

export const createClassAccessSchema = z.strictObject({
  userId: z.guid('Escolha a conta que receberá o acesso.'),
  classId: z.guid('Escolha a turma.'),
  reason: z.enum(ACCESS_REASONS),
  justification: z
    .string()
    .trim()
    .min(1, 'Escreva por que este acesso está sendo concedido.')
    .max(2000)
    .nullable()
    .default(null),
  startDate: z.iso.date('Informe uma data válida.').optional(),
});

export type CreateClassAccessInput = z.infer<typeof createClassAccessSchema>;
