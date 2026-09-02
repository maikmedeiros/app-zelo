import { z } from 'zod';
import { Feature } from '@/config/features';
import { SCOPES } from '@/shared/auth/session';

export const permissionSchema = z.strictObject({
  code: z.enum(Object.values(Feature)),
  scope: z.enum(SCOPES),
});

export const createRoleSchema = z.strictObject({
  code: z
    .string()
    .trim()
    .min(2, 'O código precisa de ao menos 2 caracteres.')
    .max(40)
    .toUpperCase()
    .regex(/^[A-Z][A-Z0-9_]*$/, 'Use MAIÚSCULAS_COM_UNDERSCORE.'),
  name: z.string().trim().min(1, 'Informe o nome do perfil.').max(120),
  description: z.string().trim().min(1).max(2000).nullable().default(null),
  permissions: z.array(permissionSchema).default([]),
});

export const updateRoleSchema = z
  .strictObject({
    name: z.string().trim().min(1, 'Informe o nome do perfil.').max(120).optional(),
    description: z.string().trim().min(1).max(2000).nullable().optional(),
    permissions: z.array(permissionSchema).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'Nada foi alterado.' });

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
