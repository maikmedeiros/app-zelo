'use client';

import { Toast as ToastPrimitive } from 'radix-ui';
import { X } from 'lucide-react';
import { createContext, use, useCallback, useMemo, useState, type ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

export type ToastTone = 'neutral' | 'success' | 'danger';

interface ToastMessage {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
}

interface ToastApi {
  show: (message: Omit<ToastMessage, 'id' | 'tone'> & { tone?: ToastTone }) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const TONES: Record<ToastTone, string> = {
  neutral: 'border-border',
  success: 'border-success',
  danger: 'border-danger',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const show = useCallback<ToastApi['show']>((message) => {
    setMessages((current) => [
      ...current,
      { id: Date.now() + current.length, tone: 'neutral', ...message },
    ]);
  }, []);

  const api = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext value={api}>
      <ToastPrimitive.Provider swipeDirection="right" duration={6000}>
        {children}

        {messages.map((message) => (
          <ToastPrimitive.Root
            key={message.id}
            onOpenChange={(open) => {
              if (!open) setMessages((current) => current.filter((item) => item.id !== message.id));
            }}
            className={cn(
              'flex items-start gap-3 rounded-card border-l-4 border border-border bg-surface p-4 shadow-lg',
              TONES[message.tone],
            )}
          >
            <div className="flex flex-col gap-1">
              <ToastPrimitive.Title className="font-medium">{message.title}</ToastPrimitive.Title>
              {message.description !== undefined && (
                <ToastPrimitive.Description className="text-sm text-text-muted">
                  {message.description}
                </ToastPrimitive.Description>
              )}
            </div>

            <ToastPrimitive.Close
              aria-label="Fechar aviso"
              className="ml-auto inline-flex size-11 shrink-0 items-center justify-center rounded-control hover:bg-surface-muted"
            >
              <X aria-hidden className="size-4" />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}

        <ToastPrimitive.Viewport className="fixed bottom-0 right-0 z-50 flex w-full max-w-sm flex-col gap-2 p-4" />
      </ToastPrimitive.Provider>
    </ToastContext>
  );
}

export const useToast = (): ToastApi => {
  const api = use(ToastContext);

  if (api === null) throw new Error('useToast precisa de um ToastProvider acima na árvore.');

  return api;
};
