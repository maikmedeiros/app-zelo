'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { Avatar } from '@/shared/components/avatar';
import { IconButton } from '@/shared/components/icon-button';
import { ptBR } from '@/shared/i18n/pt-BR';
import { cn } from '@/shared/utils/cn';
import { isRemoved, type JournalEntryOutput } from '../types';

const time = (iso: string): string =>
  new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

export interface JournalEntryCardProps {
  entry: JournalEntryOutput;
  isReply?: boolean;
  canEdit: boolean;
  canRemove: boolean;
  onEdit: (entry: JournalEntryOutput) => void;
  onRemove: (entry: JournalEntryOutput) => void;
  onReply?: (entry: JournalEntryOutput) => void;
  canReply?: boolean;
}

export function JournalEntryCard({
  entry,
  isReply = false,
  canEdit,
  canRemove,
  onEdit,
  onRemove,
  onReply,
  canReply = false,
}: JournalEntryCardProps) {
  const removed = isRemoved(entry);

  return (
    <article
      className={cn(
        'flex gap-3 rounded-card border border-border bg-surface p-4',
        isReply && 'ml-6 border-l-4 border-l-brand-soft sm:ml-10',
      )}
    >
      <Avatar name={entry.authorName} personId={entry.authorPersonId} size="sm" />

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="font-medium">{entry.authorName}</span>
            <span className="text-sm text-text-muted">{time(entry.createdAt)}</span>
            {entry.editedAt !== null && !removed && (
              <span className="text-sm text-text-muted">· editado</span>
            )}
          </div>

          {!removed && (canEdit || canRemove) && (
            <div className="flex items-center">
              {canEdit && (
                <IconButton label="Editar" className="size-9" onClick={() => onEdit(entry)}>
                  <Pencil aria-hidden className="size-4" />
                </IconButton>
              )}
              {canRemove && (
                <IconButton
                  label={ptBR.common.remove}
                  className="size-9"
                  onClick={() => onRemove(entry)}
                >
                  <Trash2 aria-hidden className="size-4" />
                </IconButton>
              )}
            </div>
          )}
        </div>

        {removed ? (
          <p className="text-sm italic text-text-muted">
            {ptBR.enums.journalEntryStatus[entry.status]}
            {entry.removalReason !== null && ` · ${entry.removalReason}`}
          </p>
        ) : (
          <p className="whitespace-pre-line">{entry.text}</p>
        )}

        {!removed && canReply && onReply !== undefined && !isReply && (
          <button
            type="button"
            onClick={() => onReply(entry)}
            className="self-start text-sm font-medium text-brand underline-offset-4 hover:underline"
          >
            Responder
          </button>
        )}
      </div>
    </article>
  );
}
