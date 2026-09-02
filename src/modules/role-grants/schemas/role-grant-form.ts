import { z } from 'zod';

export const createRoleGrantSchema = z.strictObject({
  userId: z.guid('Escolha a conta.'),
  roleId: z.guid('Escolha o perfil.'),
  startDate: z.iso.date('Informe uma data válida.').optional(),
});

export type CreateRoleGrantInput = z.infer<typeof createRoleGrantSchema>;
