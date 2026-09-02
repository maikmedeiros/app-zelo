import { z } from 'zod';
import { REPORT_DIMENSIONS, REPORT_LEVELS } from '../types';

export const createReportSchema = z
  .strictObject({
    studentId: z.guid('Escolha a criança.'),
    periodStart: z.iso.date('Informe uma data válida.'),
    periodEnd: z.iso.date('Informe uma data válida.'),
    synthesis: z.string().trim().min(1).max(5000).optional(),
    templateId: z.guid().optional(),
  })
  .refine((data) => data.periodEnd >= data.periodStart, {
    message: 'O fim do período não pode ser anterior ao início.',
    path: ['periodEnd'],
  });

const updateItemSchema = z
  .strictObject({
    dimension: z.enum(REPORT_DIMENSIONS),
    level: z.enum(REPORT_LEVELS).optional(),
    note: z.string().trim().max(2000).nullable().optional(),
  })
  .refine((item) => item.level !== undefined || item.note !== undefined, {
    message: 'Informe o nível, a observação ou os dois.',
  });

export const updateReportSchema = z
  .strictObject({
    periodStart: z.iso.date().optional(),
    periodEnd: z.iso.date().optional(),
    synthesis: z.string().trim().max(5000).nullable().optional(),
    items: z
      .array(updateItemSchema)
      .max(REPORT_DIMENSIONS.length)
      .refine((items) => new Set(items.map((item) => item.dimension)).size === items.length, {
        message: 'Dimensão repetida.',
      })
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'Nada foi alterado.' })
  .refine(
    (data) =>
      data.periodStart === undefined ||
      data.periodEnd === undefined ||
      data.periodEnd >= data.periodStart,
    { message: 'O fim do período não pode ser anterior ao início.', path: ['periodEnd'] },
  );

export type CreateReportInput = z.infer<typeof createReportSchema>;
export type UpdateReportInput = z.infer<typeof updateReportSchema>;
