'use client';

import { Dialog as DialogPrimitive } from 'radix-ui';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

export interface SheetContentProps {
  title: string;
  description?: string;
  side?: 'left' | 'right';
  children: ReactNode;
  className?: string;
}

export function SheetContent({
  title,
  description,
  side = 'left',
  children,
  className,
}: SheetContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/50" />
      <DialogPrimitive.Content
        className={cn(
          'fixed inset-y-0 z-50 flex w-80 max-w-[85vw] flex-col gap-4 border-border bg-surface p-4 shadow-lg',
          side === 'left' ? 'left-0 border-r' : 'right-0 border-l',
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <DialogPrimitive.Title className="text-lg font-semibold">{title}</DialogPrimitive.Title>
            {description !== undefined && (
              <DialogPrimitive.Description className="text-sm text-text-muted">
                {description}
              </DialogPrimitive.Description>
            )}
          </div>

          <DialogPrimitive.Close
            aria-label="Fechar"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-control hover:bg-surface-muted"
          >
            <X aria-hidden className="size-5" />
          </DialogPrimitive.Close>
        </div>

        <div className="flex-1 overflow-y-auto">{children}</div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
