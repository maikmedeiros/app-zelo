import { z } from 'zod';
import { isValidCpf, normalizeCpf } from '@/shared/utils/cpf';
import { PERSON_ROLES } from '../types';

const ROLE_FILTERS = [...PERSON_ROLES, 'none'] as const;

export const findListPeopleSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cpf: z
    .string()
    .transform(normalizeCpf)
    .refine(isValidCpf, { message: 'CPF inválido' })
    .optional(),
  search: z.string().trim().min(2).max(120).optional(),
  role: z.enum(ROLE_FILTERS).optional(),
});

export type FindListPeopleParams = z.infer<typeof findListPeopleSchema>;
