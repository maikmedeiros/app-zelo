'use client';

import { clientApi } from '@/shared/api/client';
import type { UpdateJournalEntryInput } from '../schemas/journal';
import type { JournalEntryOutput } from '../types';

export const updateJournalEntry = (
  studentId: string,
  entryId: string,
  input: UpdateJournalEntryInput,
) => clientApi.patch<JournalEntryOutput>(`/students/${studentId}/journal/${entryId}`, input);
