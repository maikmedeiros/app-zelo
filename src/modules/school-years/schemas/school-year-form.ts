import { z } from 'zod';

export const createSchoolYearSchema = z
  .strictObject({
    year: z.coerce.number().int().min(2000, 'Ano fora do intervalo.').max(2100),
    startDate: z.iso.date('Informe uma data válida.'),
    endDate: z.iso.date('Informe uma data válida.'),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: 'O fim precisa ser posterior ao início.',
    path: ['endDate'],
  });

export const updateSchoolYearSchema = z
  .strictObject({
    year: z.coerce.number().int().min(2000).max(2100).optional(),
    startDate: z.iso.date().optional(),
    endDate: z.iso.date().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'Nada foi alterado.' })
  .refine(
    (data) =>
      data.startDate === undefined || data.endDate === undefined || data.endDate > data.startDate,
    { message: 'O fim precisa ser posterior ao início.', path: ['endDate'] },
  );

export type CreateSchoolYearInput = z.infer<typeof createSchoolYearSchema>;
export type UpdateSchoolYearInput = z.infer<typeof updateSchoolYearSchema>;
