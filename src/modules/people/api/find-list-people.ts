import 'server-only';
import { serverApi } from '@/shared/api/server';
import type { Paginated } from '@/shared/api/types';
import type { FindListPeopleParams, PersonOutput } from '../types';

export const findListPeople = (params: FindListPeopleParams = {}) =>
  serverApi.get<Paginated<PersonOutput>>('/people', { params });
