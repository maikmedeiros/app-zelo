'use client';

import { AlertDialog as AlertDialogPrimitive } from 'radix-ui';
import type { ReactNode } from 'react';
import { ptBR } from '@/shared/i18n/pt-BR';
import { Button, type ButtonVariant } from './button';

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

export interface AlertDialogContentProps {
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: ButtonVariant;
  onConfirm: () => void;
  pending?: boolean;
}

export function AlertDialogContent({
  title,
  description,
  confirmLabel = ptBR.common.confirm,
  cancelLabel = ptBR.common.cancel,
  confirmVariant = 'danger',
  onConfirm,
  pending = false,
}: AlertDialogContentProps) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/50" />
      <AlertDialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-card border border-border bg-surface p-5 shadow-lg">
        <AlertDialogPrimitive.Title className="text-lg font-semibold">
          {title}
        </AlertDialogPrimitive.Title>
        <AlertDialogPrimitive.Description className="text-text-muted">
          {description}
        </AlertDialogPrimitive.Description>

        <div className="flex justify-end gap-2">
          <AlertDialogPrimitive.Cancel asChild>
            <Button variant="secondary" disabled={pending}>
              {cancelLabel}
            </Button>
          </AlertDialogPrimitive.Cancel>
          <AlertDialogPrimitive.Action asChild>
            <Button variant={confirmVariant} onClick={onConfirm} disabled={pending}>
              {confirmLabel}
            </Button>
          </AlertDialogPrimitive.Action>
        </div>
      </AlertDialogPrimitive.Content>
    </AlertDialogPrimitive.Portal>
  );
}
