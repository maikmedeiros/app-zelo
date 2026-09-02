/* eslint-disable @next/next/no-img-element */
import { cn } from '@/shared/utils/cn';

const SIZES = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-16 text-lg',
} as const;

const PIXELS = { sm: 32, md: 40, lg: 64 } as const;

export type AvatarSize = keyof typeof SIZES;

export interface AvatarProps {
  name: string;
  personId?: string;
  size?: AvatarSize;
  className?: string;
}

const initials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .filter((part) => part.length > 2 || part === name)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

export function Avatar({ name, personId, size = 'md', className }: AvatarProps) {
  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-brand-soft',
        SIZES[size],
        className,
      )}
    >
      <span aria-hidden className="font-medium text-brand">
        {initials(name)}
      </span>

      {personId !== undefined && (
        <img
          src={`/api/v1/people/${personId}/photo`}
          alt=""
          width={PIXELS[size]}
          height={PIXELS[size]}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover"
        />
      )}

      <span className="sr-only">{name}</span>
    </span>
  );
}
