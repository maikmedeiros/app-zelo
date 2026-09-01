'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/button';
import { Dialog, DialogContent } from '@/shared/components/dialog';
import { Field } from '@/shared/components/field';
import { Textarea } from '@/shared/components/textarea';
import { ptBR } from '@/shared/i18n/pt-BR';
import type { CommentOutput } from '../types';

const MIN_REASON = 3;

export interface RemoveCommentDialogProps {
  comment: CommentOutput | null;
  isAuthor: boolean;
  pending: boolean;
  onCancel: () => void;
  onConfirm: (reason?: string) => void;
}

function RemoveCommentForm({
  isAuthor,
  pending,
  onCancel,
  onConfirm,
}: Omit<RemoveCommentDialogProps, 'comment'>) {
  const [reason, setReason] = useState('');

  const reasonRequired = !isAuthor;
  const tooShort = reasonRequired && reason.trim().length < MIN_REASON;

  return (
    <DialogContent
      title="Remover o comentário?"
      description={
        reasonRequired
          ? 'O comentário some da conversa e fica marcado como removido pela escola. Diga o motivo — ele fica registrado.'
          : 'Seu comentário some da conversa e fica marcado como removido pelo autor.'
      }
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={pending}>
            {ptBR.common.cancel}
          </Button>
          <Button
            variant="danger"
            disabled={pending || tooShort}
            onClick={() => onConfirm(reasonRequired ? reason.trim() : undefined)}
          >
            {ptBR.common.remove}
          </Button>
        </>
      }
    >
      {reasonRequired && (
        <Field
          id="motivo-remocao"
          label="Motivo"
          required
          error={tooShort && reason.length > 0 ? 'Use pelo menos 3 caracteres.' : undefined}
        >
          <Textarea
            id="motivo-remocao"
            rows={3}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            aria-invalid={tooShort && reason.length > 0}
          />
        </Field>
      )}
    </DialogContent>
  );
}

export function RemoveCommentDialog({ comment, ...rest }: RemoveCommentDialogProps) {
  return (
    <Dialog
      open={comment !== null}
      onOpenChange={(open) => {
        if (!open) rest.onCancel();
      }}
    >
      {comment !== null && <RemoveCommentForm key={comment.id} {...rest} />}
    </Dialog>
  );
}
