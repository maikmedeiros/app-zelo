export interface GuardianOutput {
  id: string;
  personId: string;
  personName: string;
  cpf: string | null;
  phone: string | null;
  contactEmail: string | null;
  receiveEmail: boolean;
  receivePush: boolean;
  studentCount: number;
}
