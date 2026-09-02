import 'server-only';
import { serverApi } from '@/shared/api/server';
import type { Paginated } from '@/shared/api/types';
import type { FindListTeacherLinksParams } from '../schemas/find-list-teacher-links';
import type { TeacherLinkOutput } from '../types';

export const findListTeacherLinks = (params: Partial<FindListTeacherLinksParams> = {}) =>
  serverApi.get<Paginated<TeacherLinkOutput>>('/teacher-links', { params });
