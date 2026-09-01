'use client';

import { clientApi } from '@/shared/api/client';
import type { DeleteJournalEntryInput } from '../schemas/journal';

export const deleteJournalEntry = (
  studentId: string,
  entryId: string,
  input: DeleteJournalEntryInput = {},
) => clientApi.delete(`/students/${studentId}/journal/${entryId}`, { body: input });
