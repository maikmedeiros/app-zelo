import { z } from 'zod';

const publicEnvSchema = z.object({
  NEXT_PUBLIC_UPLOAD_MAX_BYTES: z.coerce.number().int().positive().default(10_485_760),
});

// O Next inlina `process.env.NEXT_PUBLIC_*` só quando o acesso é literal — nada de varrer
// `process.env` aqui, porque no bundle do cliente esse objeto chega vazio.
const parsed = publicEnvSchema.safeParse({
  NEXT_PUBLIC_UPLOAD_MAX_BYTES: process.env.NEXT_PUBLIC_UPLOAD_MAX_BYTES,
});

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.') || '(raiz)'}: ${issue.message}`)
    .join('\n');
  throw new Error(`Variáveis de ambiente públicas inválidas:\n${details}`);
}

export const publicEnv = {
  uploadMaxBytes: parsed.data.NEXT_PUBLIC_UPLOAD_MAX_BYTES,
  /** Espelha o que a API aceita: ela confere os bytes, não o `mimetype` do cliente. */
  acceptedImageMimeTypes: ['image/jpeg', 'image/png', 'image/webp'] as const,
} as const;
