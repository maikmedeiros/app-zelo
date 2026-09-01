'use client';

import { clientApi } from '@/shared/api/client';
import type { CreateJournalEntryInput } from '../schemas/journal';
import type { JournalEntryOutput } from '../types';

export const createJournalEntry = (studentId: string, input: CreateJournalEntryInput) =>
  clientApi.post<JournalEntryOutput>(`/students/${studentId}/journal`, input);
