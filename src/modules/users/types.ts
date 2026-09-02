export interface UserAccountOutput {
  id: string;
  personId: string;
  personName: string;
  email: string;
  active: boolean;
  emailVerified: boolean;
  lastAccessAt: string | null;
  profiles: string[];
}
