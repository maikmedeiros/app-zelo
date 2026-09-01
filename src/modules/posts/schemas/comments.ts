import { z } from 'zod';

export const createCommentSchema = z.strictObject({
  body: z.string().trim().min(1, 'Escreva o comentário.').max(2000),
});

export const deleteCommentSchema = z.strictObject({
  reason: z.string().trim().min(3, 'Explique em pelo menos 3 caracteres.').max(500).optional(),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type DeleteCommentInput = z.infer<typeof deleteCommentSchema>;
