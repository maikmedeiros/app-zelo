import { z } from 'zod';
import { RELATIONSHIPS } from '../types';

export const createGuardianLinkSchema = z.strictObject({
  guardianId: z.guid('Escolha o responsável.'),
  studentId: z.guid('Escolha a criança.'),
  relationship: z.enum(RELATIONSHIPS),
  canConsent: z.boolean().default(false),
  financial: z.boolean().default(false),
  startDate: z.iso.date('Informe uma data válida.').optional(),
});

export const updateGuardianLinkSchema = z
  .strictObject({
    relationship: z.enum(RELATIONSHIPS).optional(),
    canConsent: z.boolean().optional(),
    financial: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'Nada foi alterado.' });

export type CreateGuardianLinkInput = z.infer<typeof createGuardianLinkSchema>;
export type UpdateGuardianLinkInput = z.infer<typeof updateGuardianLinkSchema>;
