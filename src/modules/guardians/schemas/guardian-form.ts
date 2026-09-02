import { z } from 'zod';

export const createGuardianSchema = z.strictObject({
  personId: z.guid('Escolha a pessoa.'),
  receiveEmail: z.boolean().default(true),
  receivePush: z.boolean().default(true),
});

export const updateGuardianSchema = z
  .strictObject({
    receiveEmail: z.boolean().optional(),
    receivePush: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'Nada foi alterado.' });

export type CreateGuardianInput = z.infer<typeof createGuardianSchema>;
export type UpdateGuardianInput = z.infer<typeof updateGuardianSchema>;
