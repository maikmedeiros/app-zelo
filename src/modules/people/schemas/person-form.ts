import { z } from 'zod';
import { isValidCpf, normalizeCpf } from '@/shared/utils/cpf';

const name = z.string().trim().min(1, 'Informe o nome.').max(200);
const socialName = z.string().trim().min(1).max(200).nullable();
const birthDate = z.iso.date('Informe uma data válida.').nullable();
const cpf = z
  .string()
  .transform(normalizeCpf)
  .refine(isValidCpf, { message: 'CPF inválido.' })
  .nullable();
const phone = z.string().trim().min(8, 'Telefone curto demais.').max(20).nullable();
const contactEmail = z.email('E-mail inválido.').max(255).nullable();

export const createPersonSchema = z.strictObject({
  name,
  socialName: socialName.default(null),
  birthDate: birthDate.default(null),
  cpf: cpf.default(null),
  phone: phone.default(null),
  contactEmail: contactEmail.default(null),
});

export const updatePersonSchema = z
  .strictObject({
    name: name.optional(),
    socialName: socialName.optional(),
    birthDate: birthDate.optional(),
    cpf: cpf.optional(),
    phone: phone.optional(),
    contactEmail: contactEmail.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'Nada foi alterado.' });

export type CreatePersonInput = z.infer<typeof createPersonSchema>;
export type UpdatePersonInput = z.infer<typeof updatePersonSchema>;
