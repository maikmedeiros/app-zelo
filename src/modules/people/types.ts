export const PERSON_ROLES = ['student', 'guardian', 'teacher'] as const;

export type PersonRole = (typeof PERSON_ROLES)[number];

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
  role?: PersonRole | 'none';
};
