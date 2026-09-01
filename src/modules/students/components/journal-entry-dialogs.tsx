'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/button';
import { Dialog, DialogContent } from '@/shared/components/dialog';
import { Field } from '@/shared/components/field';
import { Textarea } from '@/shared/components/textarea';
import { ptBR } from '@/shared/i18n/pt-BR';
import type { JournalEntryOutput } from '../types';

export function EditEntryDialog({
  entry,
  pending,
  onCancel,
  onConfirm,
}: {
  entry: JournalEntryOutput | null;
  pending: boolean;
  onCancel: () => void;
  onConfirm: (text: string) => void;
}) {
  return (
    <Dialog
      open={entry !== null}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      {entry !== null && (
        <EditEntryForm
          key={entry.id}
          initialText={entry.text ?? ''}
          pending={pending}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      )}
    </Dialog>
  );
}

function EditEntryForm({
  initialText,
  pending,
  onCancel,
  onConfirm,
}: {
  initialText: string;
  pending: boolean;
  onCancel: () => void;
  onConfirm: (text: string) => void;
}) {
  const [text, setText] = useState(initialText);
  const empty = text.trim().length === 0;

  return (
    <DialogContent
      title="Editar registro"
      description="A entrada passa a mostrar que foi editada — a família vê isso."
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={pending}>
            {ptBR.common.cancel}
          </Button>
          <Button disabled={pending || empty} onClick={() => onConfirm(text.trim())}>
            Salvar
          </Button>
        </>
      }
    >
      <Field id="editar-registro" label="Texto">
        <Textarea
          id="editar-registro"
          rows={5}
          value={text}
          maxLength={4000}
          onChange={(event) => setText(event.target.value)}
        />
      </Field>
    </DialogContent>
  );
}

export function RemoveEntryDialog({
  entry,
  isAuthor,
  pending,
  onCancel,
  onConfirm,
}: {
  entry: JournalEntryOutput | null;
  isAuthor: boolean;
  pending: boolean;
  onCancel: () => void;
  onConfirm: (reason?: string) => void;
}) {
  return (
    <Dialog
      open={entry !== null}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      {entry !== null && (
        <RemoveEntryForm
          key={entry.id}
          isAuthor={isAuthor}
          pending={pending}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      )}
    </Dialog>
  );
}

function RemoveEntryForm({
  isAuthor,
  pending,
  onCancel,
  onConfirm,
}: {
  isAuthor: boolean;
  pending: boolean;
  onCancel: () => void;
  onConfirm: (reason?: string) => void;
}) {
  const [reason, setReason] = useState('');

  return (
    <DialogContent
      title="Remover o registro?"
      description={
        isAuthor
          ? 'O texto some da agenda e fica marcado como removido pelo autor.'
          : 'O texto some da agenda e fica marcado como removido pela escola. O motivo é opcional, mas fica registrado.'
      }
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={pending}>
            {ptBR.common.cancel}
          </Button>
          <Button
            variant="danger"
            disabled={pending}
            onClick={() => onConfirm(reason.trim().length > 0 ? reason.trim() : undefined)}
          >
            {ptBR.common.remove}
          </Button>
        </>
      }
    >
      <Field id="motivo-registro" label="Motivo (opcional)">
        <Textarea
          id="motivo-registro"
          rows={3}
          value={reason}
          maxLength={500}
          onChange={(event) => setReason(event.target.value)}
        />
      </Field>
    </DialogContent>
  );
}
