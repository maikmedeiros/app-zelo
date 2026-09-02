export interface TeacherOutput {
  id: string;
  personId: string;
  personName: string;
  cpf: string | null;
  registration: string | null;
  education: string | null;
  active: boolean;
  classCount: number;
}
