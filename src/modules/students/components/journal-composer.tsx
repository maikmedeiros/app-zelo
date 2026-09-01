'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { isApiError, fieldErrorsFrom } from '@/shared/api/errors';
import { Button } from '@/shared/components/button';
import { Field } from '@/shared/components/field';
import { Textarea } from '@/shared/components/textarea';
import { useToast } from '@/shared/components/toast';
import { createJournalEntry } from '../api/create-journal-entry.client';
import { createJournalEntrySchema } from '../schemas/journal';
import type { JournalEntryOutput } from '../types';

export interface JournalComposerProps {
  studentId: string;
  referenceDate: string;
  replyingTo: JournalEntryOutput | null;
  onCancelReply: () => void;
  onSaved: () => void;
}

export function JournalComposer({
  studentId,
  referenceDate,
  replyingTo,
  onCancelReply,
  onSaved,
}: JournalComposerProps) {
  const toast = useToast();
  const [text, setText] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    const parsed = createJournalEntrySchema.safeParse({
      text,
      referenceDate,
      ...(replyingTo === null ? {} : { repliesToId: replyingTo.id }),
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message);
      return;
    }

    setError(undefined);
    setSaving(true);

    try {
      await createJournalEntry(studentId, parsed.data);
      setText('');
      onCancelReply();
      onSaved();
    } catch (caught) {
      if (isApiError(caught) && caught.statusCode === 400) {
        setError(fieldErrorsFrom(caught.cause).text);
      }

      toast.show({
        title: 'Não foi possível salvar o registro',
        description: isApiError(caught) ? caught.message : undefined,
        tone: 'danger',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-2">
      {replyingTo !== null && (
        <div className="flex items-center justify-between gap-2 rounded-control bg-surface-muted px-3 py-2 text-sm">
          <span className="truncate">
            Respondendo a <strong>{replyingTo.authorName}</strong>
          </span>
          <button
            type="button"
            onClick={onCancelReply}
            aria-label="Cancelar resposta"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-control"
          >
            <X aria-hidden className="size-4" />
          </button>
        </div>
      )}

      <Field
        id="registro"
        label={replyingTo === null ? 'Novo registro do dia' : 'Sua resposta'}
        error={error}
      >
        <Textarea
          id="registro"
          rows={3}
          value={text}
          maxLength={4000}
          aria-invalid={error !== undefined}
          onChange={(event) => setText(event.target.value)}
        />
      </Field>

      <Button type="submit" size="sm" disabled={saving} className="self-start">
        {saving ? 'Salvando…' : replyingTo === null ? 'Registrar' : 'Responder'}
      </Button>
    </form>
  );
}
