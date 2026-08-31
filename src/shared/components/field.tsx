import type { ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

export interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

export function Field({ id, label, hint, error, required, className, children }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required === true && (
          <span aria-hidden className="ml-0.5 text-danger">
            *
          </span>
        )}
      </label>

      {hint !== undefined && (
        <p id={`${id}-hint`} className="text-sm text-text-muted">
          {hint}
        </p>
      )}

      {children}

      {error !== undefined && (
        <p id={`${id}-error`} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export const describedBy = (id: string, hint?: string, error?: string): string | undefined => {
  const ids = [hint !== undefined ? `${id}-hint` : null, error !== undefined ? `${id}-error` : null]
    .filter((value): value is string => value !== null)
    .join(' ');

  return ids.length > 0 ? ids : undefined;
};
