import 'server-only';
import { serverApi } from '@/shared/api/server';
import type { Paginated } from '@/shared/api/types';
import type { FindListTeacherLinksParams, TeacherLinkOutput } from '../types';

export const findListTeacherLinks = (params: FindListTeacherLinksParams = {}) =>
  serverApi.get<Paginated<TeacherLinkOutput>>('/teacher-links', { params });
