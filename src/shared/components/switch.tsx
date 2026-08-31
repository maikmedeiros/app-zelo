'use client';

import { Switch as SwitchPrimitive } from 'radix-ui';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/shared/utils/cn';

export interface SwitchProps extends ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  label: string;
}

export function Switch({ label, className, id, ...props }: SwitchProps) {
  return (
    <div className="flex items-center gap-3">
      <SwitchPrimitive.Root
        id={id}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full bg-surface-muted transition-colors',
          'data-[state=checked]:bg-brand',
          className,
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb className="block size-5 translate-x-0.5 rounded-full bg-surface shadow transition-transform data-[state=checked]:translate-x-[1.375rem]" />
      </SwitchPrimitive.Root>

      <label htmlFor={id} className="flex min-h-11 items-center text-sm">
        {label}
      </label>
    </div>
  );
}
