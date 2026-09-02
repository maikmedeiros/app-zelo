'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Field } from '@/shared/components/field';
import { Input } from '@/shared/components/input';
import { cn } from '@/shared/utils/cn';
import { MIN_PASSWORD_LENGTH } from '../schemas/user-form';

const LEVELS = [
  { label: 'Muito fraca', tone: 'bg-danger' },
  { label: 'Fraca', tone: 'bg-danger' },
  { label: 'Razoável', tone: 'bg-accent' },
  { label: 'Boa', tone: 'bg-success' },
  { label: 'Forte', tone: 'bg-success' },
] as const;

const WEAKEST = LEVELS[0];

export const passwordScore = (password: string): number => {
  if (password.length === 0) return 0;

  const variety = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((pattern) =>
    pattern.test(password),
  ).length;

  const length = password.length >= 16 ? 2 : password.length >= 12 ? 1 : 0;

  return Math.min(variety + length, LEVELS.length) - 1;
};

export interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  required?: boolean;
}

export function PasswordField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  required,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  const score = passwordScore(value);
  const level = LEVELS[Math.max(score, 0)] ?? WEAKEST;
  const tooShort = value.length > 0 && value.length < MIN_PASSWORD_LENGTH;

  return (
    <Field id={id} label={label} required={required} hint={hint} error={error}>
      <div className="flex flex-col gap-2">
        <div className="relative">
          <Input
            id={id}
            type={visible ? 'text' : 'password'}
            value={value}
            maxLength={1024}
            autoComplete="new-password"
            aria-invalid={error !== undefined}
            className="pr-12"
            onChange={(event) => onChange(event.target.value)}
          />
          <button
            type="button"
            aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
            onClick={() => setVisible((current) => !current)}
            className="absolute right-1 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-control text-text-muted hover:bg-surface-muted"
          >
            {visible ? (
              <EyeOff aria-hidden className="size-4" />
            ) : (
              <Eye aria-hidden className="size-4" />
            )}
          </button>
        </div>

        {value.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex h-1.5 flex-1 gap-1">
              {LEVELS.map((_, index) => (
                <span
                  key={index}
                  className={cn(
                    'flex-1 rounded-full',
                    index <= score ? level.tone : 'bg-surface-muted',
                  )}
                />
              ))}
            </div>
            <span aria-live="polite" className="text-sm text-text-muted">
              {tooShort ? `Mínimo ${MIN_PASSWORD_LENGTH} caracteres` : level.label}
            </span>
          </div>
        )}
      </div>
    </Field>
  );
}
