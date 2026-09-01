export interface StudentOutput {
  id: string;
  personId: string;
  personName: string;
  birthDate: string | null;
  code: string | null;
  notes: string | null;
  active: boolean;
  classId: string | null;
  className: string | null;
}

export type FindListStudentsParams = {
  page?: number;
  limit?: number;
  classId?: string;
  search?: string;
  active?: boolean;
};
