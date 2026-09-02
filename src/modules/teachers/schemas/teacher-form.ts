import { z } from 'zod';

const registration = z.string().trim().min(1).max(30).nullable();
const education = z.string().trim().min(1).max(2000).nullable();

export const createTeacherSchema = z.strictObject({
  personId: z.guid('Escolha a pessoa.'),
  registration: registration.default(null),
  education: education.default(null),
});

export const updateTeacherSchema = z
  .strictObject({
    registration: registration.optional(),
    education: education.optional(),
    active: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'Nada foi alterado.' });

export type CreateTeacherInput = z.infer<typeof createTeacherSchema>;
export type UpdateTeacherInput = z.infer<typeof updateTeacherSchema>;
