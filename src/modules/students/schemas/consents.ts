import { z } from 'zod';
import { CONSENT_ORIGINS, CONSENT_TYPES } from '../types';

export const createConsentSchema = z
  .strictObject({
    type: z.enum(CONSENT_TYPES),
    granted: z.boolean(),
    origin: z.enum(CONSENT_ORIGINS),
    guardianId: z.guid('Escolha o responsável signatário.').optional(),
    documentKey: z.string().trim().min(1).max(500).optional(),
    note: z.string().trim().min(1).max(1000).optional(),
  })
  .refine((data) => data.origin !== 'SOLICITACAO_VERBAL' || data.documentKey !== undefined, {
    message: 'Consentimento verbal exige o documento que o comprova',
    path: ['documentKey'],
  });

export type CreateConsentInput = z.infer<typeof createConsentSchema>;

export const findListConsentsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  type: z.enum(CONSENT_TYPES).optional(),
  current: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
});

export type FindListConsentsParams = z.infer<typeof findListConsentsSchema>;
