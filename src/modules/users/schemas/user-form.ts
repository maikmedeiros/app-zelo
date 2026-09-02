import { z } from 'zod';

export const MIN_PASSWORD_LENGTH = 8;

const email = z.email('E-mail inválido.').max(255).toLowerCase();
const password = z
  .string()
  .min(MIN_PASSWORD_LENGTH, `A senha precisa de ao menos ${MIN_PASSWORD_LENGTH} caracteres.`)
  .max(1024);

export const createUserSchema = z.strictObject({
  personId: z.guid('Escolha a pessoa.'),
  email,
  password,
});

export const updateUserSchema = z
  .strictObject({
    email: email.optional(),
    password: password.optional(),
    active: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'Nada foi alterado.' });

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
