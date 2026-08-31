'use client';

import { TriangleAlert } from 'lucide-react';
import { ptBR } from '@/shared/i18n/pt-BR';
import { Button } from './button';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-card border border-border bg-surface px-6 py-12 text-center"
    >
      <TriangleAlert aria-hidden className="size-6 text-danger" />
      <p className="font-medium">{title ?? ptBR.errors.title}</p>
      <p className="text-text-muted">{description ?? ptBR.errors.description}</p>

      {onRetry !== undefined && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          {ptBR.common.retry}
        </Button>
      )}
    </div>
  );
}
