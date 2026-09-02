'use client';

import { ScrollText } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/button';
import { DatePicker } from '@/shared/components/date-picker';
import { Dialog, DialogClose, DialogContent } from '@/shared/components/dialog';
import { Field } from '@/shared/components/field';
import { Select } from '@/shared/components/select';
import { Textarea } from '@/shared/components/textarea';
import { useApiAction } from '@/shared/hooks/use-api-action';
import { ptBR } from '@/shared/i18n/pt-BR';
import { todayIso } from '@/shared/utils/date';
import { ClassPicker } from '@/modules/classes/components/class-picker';
import { UserPicker } from '@/modules/users/components/user-picker';
import { createClassAccess } from '../api/create-class-access.client';
import { createClassAccessSchema } from '../schemas/create-class-access';
import { ACCESS_REASONS, type AccessReason } from '../types';

const REASON_OPTIONS = ACCESS_REASONS.map((reason) => ({
  value: reason,
  label: ptBR.enums.accessReason[reason],
}));

export interface ClassAccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClassAccessDialog({ open, onOpenChange }: ClassAccessDialogProps) {
  const { run, pending, fieldErrors } = useApiAction();

  const [userId, setUserId] = useState<string | null>(null);
  const [classId, setClassId] = useState<string | null>(null);
  const [reason, setReason] = useState<AccessReason>('COORDENACAO');
  const [justification, setJustification] = useState('');
  const [startDate, setStartDate] = useState(todayIso());
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(undefined);

    const trimmed = justification.trim();

    const parsed = createClassAccessSchema.safeParse({
      userId,
      classId,
      reason,
      justification: trimmed.length === 0 ? null : trimmed,
      ...(startDate === '' ? {} : { startDate }),
    });

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message);
      return;
    }

    await run(() => createClassAccess(parsed.data), {
      success: 'Acesso concedido',
      failure: 'Não foi possível conceder o acesso',
      onSuccess: () => {
        setUserId(null);
        setJustification('');
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title="Conceder acesso a turma"
        description="Este é o caminho da direção, da coordenação e da secretaria para ver uma turma sem lecionar nela."
        footer={
          <>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={pending}>
                {ptBR.common.cancel}
              </Button>
            </DialogClose>
            <Button type="submit" form="formulario-acesso-turma" disabled={pending}>
              {pending ? 'Concedendo…' : 'Conceder acesso'}
            </Button>
          </>
        }
      >
        <form
          id="formulario-acesso-turma"
          onSubmit={submit}
          noValidate
          className="flex flex-col gap-4"
        >
          <p className="flex items-start gap-2 rounded-card border border-border p-3 text-sm text-text-muted">
            <ScrollText aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
            Decisão administrativa auditada: fica registrado quem concedeu, a quem, para qual turma,
            por qual motivo e desde quando. Encerrar não apaga a trilha.
          </p>

          <Field id="acesso-usuario" label="Conta" required error={fieldErrors.userId ?? formError}>
            <UserPicker
              id="acesso-usuario"
              value={userId}
              onChange={setUserId}
              invalid={fieldErrors.userId !== undefined}
            />
          </Field>

          <Field id="acesso-turma" label="Turma" required error={fieldErrors.classId}>
            <ClassPicker
              id="acesso-turma"
              value={classId}
              onChange={setClassId}
              invalid={fieldErrors.classId !== undefined}
            />
          </Field>

          <Field id="acesso-motivo" label="Motivo" required error={fieldErrors.reason}>
            <Select
              id="acesso-motivo"
              value={reason}
              onValueChange={(value) => setReason(value as AccessReason)}
              options={REASON_OPTIONS}
            />
          </Field>

          <Field
            id="acesso-justificativa"
            label="Justificativa"
            hint="É o que a trilha responde quando alguém perguntar por que esta conta viu esta turma."
            error={fieldErrors.justification}
          >
            <Textarea
              id="acesso-justificativa"
              rows={3}
              value={justification}
              maxLength={2000}
              aria-invalid={fieldErrors.justification !== undefined}
              onChange={(event) => setJustification(event.target.value)}
            />
          </Field>

          <Field
            id="acesso-inicio"
            label="Início da vigência"
            hint="Em branco, a API grava a data de hoje."
            error={fieldErrors.startDate}
          >
            <DatePicker
              id="acesso-inicio"
              value={startDate}
              aria-invalid={fieldErrors.startDate !== undefined}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </Field>
        </form>
      </DialogContent>
    </Dialog>
  );
}
