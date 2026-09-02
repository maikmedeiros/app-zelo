import type { ReportDimension, ReportLevel } from '@/modules/reports/types';

export interface ReportTemplateItemOutput {
  id: string;
  dimension: ReportDimension;
  level: ReportLevel | null;
  note: string | null;
}

export interface ReportTemplateOutput {
  id: string;
  name: string;
  description: string | null;
  authorId: string;
  authorName: string;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReportTemplateDetailOutput extends ReportTemplateOutput {
  synthesis: string | null;
  items: ReportTemplateItemOutput[];
}
