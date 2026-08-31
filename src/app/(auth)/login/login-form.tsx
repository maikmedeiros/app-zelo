'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authApi } from '@/shared/api/client';
import { fieldErrorsFrom, isApiError } from '@/shared/api/errors';
import {
  createSessionSchema,
  type CreateSessionInput,
} from '@/modules/sessions/schemas/create-session';
import { ptBR } from '@/shared/i18n/pt-BR';
import { cn } from '@/shared/utils/cn';

const FALLBACK_DESTINATION = '/';

const safeDestination = (next: string | undefined): string => {
  if (next === undefined) return FALLBACK_DESTINATION;
  if (!next.startsWith('/') || next.startsWith('//')) return FALLBACK_DESTINATION;

  return next;
};

const fieldClassName = (hasError: boolean): string =>
  cn(
    'w-full rounded-control border bg-surface px-3 py-2 text-text',
    hasError ? 'border-danger' : 'border-border',
  );

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateSessionInput>({
    resolver: zodResolver(createSessionSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await authApi.login(values);

      router.replace(safeDestination(next));
      router.refresh();
    } catch (error) {
      if (isApiError(error) && error.statusCode === 400) {
        const fields = fieldErrorsFrom(error.cause);

        for (const [field, message] of Object.entries(fields)) {
          if (field === 'email' || field === 'password') setError(field, { message });
        }

        if (Object.keys(fields).length > 0) return;
      }

      const message =
        isApiError(error) && error.statusCode === 401
          ? ptBR.auth.invalidCredentials
          : ptBR.auth.unexpected;

      setError('root', { message });
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      {errors.root?.message !== undefined && (
        <p role="alert" className="rounded-control bg-danger-soft px-3 py-2 text-sm text-danger">
          {errors.root.message}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          {ptBR.auth.email}
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          aria-invalid={errors.email !== undefined}
          aria-describedby={errors.email !== undefined ? 'email-error' : undefined}
          className={fieldClassName(errors.email !== undefined)}
          {...register('email')}
        />
        {errors.email?.message !== undefined && (
          <p id="email-error" className="text-sm text-danger">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium">
          {ptBR.auth.password}
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={errors.password !== undefined}
          aria-describedby={errors.password !== undefined ? 'password-error' : undefined}
          className={fieldClassName(errors.password !== undefined)}
          {...register('password')}
        />
        {errors.password?.message !== undefined && (
          <p id="password-error" className="text-sm text-danger">
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-control bg-brand px-4 py-2 font-medium text-on-brand hover:bg-brand-hover disabled:opacity-60"
      >
        {isSubmitting ? ptBR.auth.submitting : ptBR.auth.submit}
      </button>
    </form>
  );
}
