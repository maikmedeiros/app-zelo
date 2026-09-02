import 'server-only';
import { cache } from 'react';
import { orNotFound } from '@/shared/api/not-found';
import { findClassById } from './find-class-by-id';

export const getClassById = cache((classId: string) => orNotFound(findClassById(classId)));
