import { z } from 'zod';
import { CLASS_SHIFTS } from '../types';

export const createClassSchema = z.strictObject({
  schoolYearId: z.guid('Escolha o ano letivo.'),
  name: z.string().trim().min(1, 'Dê um nome à turma.').max(100),
  segment: z.string().trim().min(1, 'Informe o segmento.').max(100),
  shift: z.enum(CLASS_SHIFTS),
});

export const updateClassSchema = z
  .strictObject({
    name: z.string().trim().min(1, 'Dê um nome à turma.').max(100).optional(),
    segment: z.string().trim().min(1, 'Informe o segmento.').max(100).optional(),
    shift: z.enum(CLASS_SHIFTS).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'Nada foi alterado.' });

export type CreateClassInput = z.infer<typeof createClassSchema>;
export type UpdateClassInput = z.infer<typeof updateClassSchema>;
