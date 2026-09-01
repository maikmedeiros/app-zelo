import 'server-only';
import { serverApi } from '@/shared/api/server';
import type { Paginated } from '@/shared/api/types';
import type { JournalEntryOutput } from '../types';

export type FindListJournalEntriesParams = { page?: number; limit?: number; date?: string };

export const findListJournalEntries = (
  studentId: string,
  params: FindListJournalEntriesParams = {},
) => serverApi.get<Paginated<JournalEntryOutput>>(`/students/${studentId}/journal`, { params });
