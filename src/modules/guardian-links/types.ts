export const RELATIONSHIPS = ['MAE', 'PAI', 'AVO', 'TIO', 'IRMAO', 'TUTOR_LEGAL', 'OUTRO'] as const;

export type Relationship = (typeof RELATIONSHIPS)[number];

export interface GuardianLinkOutput {
  id: string;
  guardianId: string;
  guardianName: string;
  studentId: string;
  studentName: string;
  relationship: Relationship;
  canConsent: boolean;
  financial: boolean;
  startDate: string;
  endDate: string | null;
}

export type FindListGuardianLinksParams = {
  page?: number;
  limit?: number;
  guardianId?: string;
  studentId?: string;
  active?: boolean;
};
