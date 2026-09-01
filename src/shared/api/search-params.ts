import type { z } from 'zod';

export type RawSearchParams = Record<string, string | string[] | undefined>;

export const parseSearchParams = <Schema extends z.ZodType>(
  schema: Schema,
  raw: RawSearchParams,
): z.infer<Schema> => {
  const entries = Object.entries(raw)
    .map(([key, value]) => [key, Array.isArray(value) ? value[0] : value] as const)
    .filter(([, value]) => value !== undefined && value !== '');

  const parsed = schema.safeParse(Object.fromEntries(entries));

  return parsed.success ? parsed.data : schema.parse({});
};
