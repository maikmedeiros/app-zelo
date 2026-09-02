export const SCOPES = ['PROPRIA', 'TURMA', 'ESCOLA'] as const;

export type Scope = (typeof SCOPES)[number];

export interface RolePermissionOutput {
  code: string;
  scope: Scope;
}

export interface RoleOutput {
  id: string;
  code: string;
  name: string;
  description: string | null;
  system: boolean;
  permissions: RolePermissionOutput[];
  userCount: number;
}
