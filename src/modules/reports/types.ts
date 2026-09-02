export const REPORT_DIMENSIONS = [
  'ACOLHIMENTO',
  'ALIMENTACAO',
  'SONO',
  'SOCIALIZACAO',
  'AUTONOMIA',
  'LINGUAGEM',
  'DESENVOLVIMENTO_MOTOR',
] as const;

export type ReportDimension = (typeof REPORT_DIMENSIONS)[number];

export const REPORT_LEVELS = [
  'NAO_OBSERVADO',
  'EM_INICIO',
  'EM_DESENVOLVIMENTO',
  'CONSOLIDADO',
] as const;

export type ReportLevel = (typeof REPORT_LEVELS)[number];

export const REPORT_STATUSES = ['RASCUNHO', 'PUBLICADO'] as const;

export type ReportStatus = (typeof REPORT_STATUSES)[number];

export interface ReportItemOutput {
  id: string;
  dimension: ReportDimension;
  level: ReportLevel;
  note: string | null;
}

export interface ReportOutput {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  authorId: string;
  authorName: string;
  periodStart: string;
  periodEnd: string;
  status: ReportStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReportDetailOutput extends ReportOutput {
  synthesis: string | null;
  templateId: string | null;
  items: ReportItemOutput[];
}

export const isPublished = (report: ReportOutput): boolean => report.status === 'PUBLICADO';

export const isObserved = (item: ReportItemOutput): boolean => item.level !== 'NAO_OBSERVADO';

export const hasContent = (report: ReportDetailOutput): boolean =>
  report.synthesis !== null || report.items.some(isObserved);
