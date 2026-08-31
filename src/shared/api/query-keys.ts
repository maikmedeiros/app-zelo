import type { QueryParams } from './types';

const resource = <Name extends string>(name: Name) => ({
  all: () => [name] as const,
  lists: () => [name, 'list'] as const,
  list: (params?: QueryParams) => [name, 'list', params ?? {}] as const,
  details: () => [name, 'detail'] as const,
  detail: (id: string) => [name, 'detail', id] as const,
});

export const queryKeys = {
  sessions: {
    all: () => ['sessions'] as const,
    current: () => ['sessions', 'current'] as const,
  },

  posts: {
    ...resource('posts'),
    comments: (postId: string, params?: QueryParams) =>
      ['posts', 'detail', postId, 'comments', params ?? {}] as const,
    media: (postId: string) => ['posts', 'detail', postId, 'media'] as const,
    reactions: (postId: string) => ['posts', 'detail', postId, 'reactions'] as const,
  },

  reactionTypes: {
    all: () => ['reaction-types'] as const,
    list: () => ['reaction-types', 'list'] as const,
  },

  students: {
    ...resource('students'),
    journal: (studentId: string, params?: QueryParams) =>
      ['students', 'detail', studentId, 'journal', params ?? {}] as const,
    consents: (studentId: string) => ['students', 'detail', studentId, 'consents'] as const,
  },

  classes: {
    ...resource('classes'),
    consents: (classId: string) => ['classes', 'detail', classId, 'consents'] as const,
  },

  people: {
    ...resource('people'),
    photo: (personId: string) => ['people', 'detail', personId, 'photo'] as const,
  },

  guardians: resource('guardians'),
  teachers: resource('teachers'),
  users: resource('users'),

  enrollments: resource('enrollments'),
  guardianLinks: resource('guardian-links'),
  teacherLinks: resource('teacher-links'),
  classAccesses: resource('class-accesses'),

  reports: resource('reports'),
  reportTemplates: resource('report-templates'),

  roles: resource('roles'),
  roleGrants: resource('role-grants'),
  schoolYears: resource('school-years'),
} as const;
