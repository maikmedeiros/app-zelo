import { z } from 'zod';

export const createJournalEntrySchema = z.strictObject({
  text: z.string().trim().min(1, 'Escreva o registro.').max(4000),
  referenceDate: z.iso.date().optional(),
  repliesToId: z.guid().optional(),
});

export const updateJournalEntrySchema = z.strictObject({
  text: z.string().trim().min(1, 'O registro não pode ficar vazio.').max(4000),
});

export const deleteJournalEntrySchema = z.strictObject({
  reason: z.string().trim().min(1).max(500).optional(),
});

export type CreateJournalEntryInput = z.infer<typeof createJournalEntrySchema>;
export type UpdateJournalEntryInput = z.infer<typeof updateJournalEntrySchema>;
export type DeleteJournalEntryInput = z.infer<typeof deleteJournalEntrySchema>;
