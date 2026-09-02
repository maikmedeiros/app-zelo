'use client';

import { clientApi } from '@/shared/api/client';
import type { CreateTeacherLinkInput } from '../schemas/create-teacher-link';
import type { TeacherLinkOutput } from '../types';

export const createTeacherLink = (input: CreateTeacherLinkInput) =>
  clientApi.post<TeacherLinkOutput>('/teacher-links', input);
