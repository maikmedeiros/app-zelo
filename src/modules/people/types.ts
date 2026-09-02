export const PERSON_ROLES = ['student', 'guardian', 'teacher'] as const;

export type PersonRole = (typeof PERSON_ROLES)[number];

export type PersonRoleFilter = PersonRole | 'none';

export interface PersonOutput {
  id: string;
  name: string;
  socialName: string | null;
  birthDate: string | null;
  cpf: string | null;
  phone: string | null;
  contactEmail: string | null;
  roles: Record<PersonRole, boolean>;
  hasUser: boolean;
  hasPhoto: boolean;
}

export type FindListPeopleParams = {
  page?: number;
  limit?: number;
  search?: string;
  cpf?: string;
  role?: PersonRoleFilter;
};

export const displayName = (person: PersonOutput): string => person.socialName ?? person.name;

export const hasNoRole = (person: PersonOutput): boolean =>
  !person.roles.student && !person.roles.guardian && !person.roles.teacher;

export const photoUrl = (personId: string): string => `/api/v1/people/${personId}/photo`;
