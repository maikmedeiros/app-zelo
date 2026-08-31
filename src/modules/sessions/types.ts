export interface IdentityOutput {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

export interface CurrentSessionOutput extends IdentityOutput {
  permissions: string[];
  classes: string[];
}
