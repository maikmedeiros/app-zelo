'use client';

import { Avatar as AvatarPrimitive } from 'radix-ui';
import { cn } from '@/shared/utils/cn';

const SIZES = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-16 text-lg',
} as const;

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
    <AvatarPrimitive.Root
      className={cn(
        'inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-brand-soft',
        SIZES[size],
        className,
      )}
    >
      {personId !== undefined && (
        <AvatarPrimitive.Image
          src={`/api/v1/people/${personId}/photo`}
          alt=""
          loading="lazy"
          className="size-full object-cover"
        />
      )}
      <AvatarPrimitive.Fallback delayMs={personId === undefined ? 0 : 200}>
        <span aria-hidden className="font-medium text-brand">
          {initials(name)}
        </span>
        <span className="sr-only">{name}</span>
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
