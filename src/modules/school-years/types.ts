export interface SchoolYearOutput {
  id: string;
  year: number;
  startDate: string;
  endDate: string;
  classCount: number;
}

export type FindListSchoolYearsParams = {
  page?: number;
  limit?: number;
  year?: number;
};
