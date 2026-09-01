import { z } from 'zod';

const code = z.string().trim().min(1).max(20).nullable();
const notes = z.string().trim().min(1).max(2000).nullable();

export const createStudentSchema = z.strictObject({
  personId: z.guid('Escolha a pessoa.'),
  code: code.default(null),
  notes: notes.default(null),
});

export const updateStudentSchema = z
  .strictObject({
    code: code.optional(),
    notes: notes.optional(),
    active: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'Nada foi alterado.' });

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
