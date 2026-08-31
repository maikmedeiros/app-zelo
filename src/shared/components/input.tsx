import type { InputHTMLAttributes } from 'react';
import { cn } from '@/shared/utils/cn';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const controlClassName = (invalid: boolean, className?: string): string =>
  cn(
    'w-full rounded-control border bg-surface px-3 py-2 text-text placeholder:text-text-muted',
    'disabled:cursor-not-allowed disabled:opacity-60',
    invalid ? 'border-danger' : 'border-border',
    className,
  );

export function Input({ className, ...props }: InputProps) {
  return (
    <input className={controlClassName(props['aria-invalid'] === true, className)} {...props} />
  );
}
