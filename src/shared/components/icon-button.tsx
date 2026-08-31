import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/shared/utils/cn';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export function IconButton({ label, className, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex size-11 items-center justify-center rounded-control text-text',
        'transition-colors hover:bg-surface-muted disabled:pointer-events-none disabled:opacity-60',
        className,
      )}
      {...props}
    />
  );
}
