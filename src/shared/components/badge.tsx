import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/utils/cn';

export type BadgeTone = 'neutral' | 'brand' | 'accent' | 'danger' | 'success';

const TONES: Record<BadgeTone, string> = {
  neutral: 'bg-surface-muted text-text-muted',
  brand: 'bg-brand-soft text-brand',
  accent: 'bg-accent text-on-accent',
  danger: 'bg-danger-soft text-danger',
  success: 'bg-success-soft text-success',
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-control px-2 py-0.5 text-xs font-medium',
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}
