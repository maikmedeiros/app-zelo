import 'server-only';
import { z } from 'zod';

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_URL: z.url(),
  SESSION_COOKIE_NAME: z.enum(['ZELO_APP', 'ZELO_APP_STAGING', 'ZELO_APP_DEV']),
});

const parsed = serverEnvSchema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.') || '(raiz)'}: ${issue.message}`)
    .join('\n');
  throw new Error(`Variáveis de ambiente de servidor inválidas ou ausentes:\n${details}`);
}

const data = parsed.data;

export const serverEnv = {
  nodeEnv: data.NODE_ENV,
  isProduction: data.NODE_ENV === 'production',
  apiUrl: data.API_URL.replace(/\/$/, ''),
  sessionCookieName: data.SESSION_COOKIE_NAME,
} as const;
