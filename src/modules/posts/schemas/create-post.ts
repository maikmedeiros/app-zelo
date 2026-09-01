import { z } from 'zod';
import { POST_AUDIENCES, POST_TYPES } from '../types';

export const createPostSchema = z
  .strictObject({
    audience: z.enum(POST_AUDIENCES),
    classIds: z.array(z.guid()).default([]),
    studentIds: z.array(z.guid()).default([]),
    type: z.enum(POST_TYPES).default('REGISTRO_DIARIO'),
    title: z.string().trim().min(1).max(200).nullable().default(null),
    body: z.string().trim().min(1).nullable().default(null),
    referenceDate: z.iso.date().optional(),
  })
  .refine((data) => (data.audience === 'TURMA' ? data.classIds.length > 0 : true), {
    message: 'Escolha ao menos uma turma.',
    path: ['classIds'],
  })
  .refine((data) => (data.audience === 'TURMA' ? data.studentIds.length === 0 : true), {
    message: 'Postagem para a turma não aceita alunos específicos.',
    path: ['studentIds'],
  })
  .refine((data) => (data.audience === 'ALUNO' ? data.studentIds.length > 0 : true), {
    message: 'Escolha ao menos um aluno.',
    path: ['studentIds'],
  })
  .refine((data) => (data.audience === 'ALUNO' ? data.classIds.length === 0 : true), {
    message: 'Postagem para alunos específicos não aceita turmas.',
    path: ['classIds'],
  });

export type CreatePostInput = z.infer<typeof createPostSchema>;
