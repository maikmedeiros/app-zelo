'use client';

import { ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/button';
import { Checkbox } from '@/shared/components/checkbox';
import { DatePicker } from '@/shared/components/date-picker';
import { Dialog, DialogClose, DialogContent } from '@/shared/components/dialog';
import { Field } from '@/shared/components/field';
import { Select } from '@/shared/components/select';
import { useApiAction } from '@/shared/hooks/use-api-action';
import { ptBR } from '@/shared/i18n/pt-BR';
import { todayIso } from '@/shared/utils/date';
import { GuardianPicker } from '@/modules/guardians/components/guardian-picker';
import { StudentPicker } from '@/modules/students/components/student-picker';
import { createGuardianLink } from '../api/create-guardian-link.client';
import { createGuardianLinkSchema } from '../schemas/guardian-link-form';
import { RELATIONSHIPS, type Relationship } from '../types';

const RELATIONSHIP_OPTIONS = RELATIONSHIPS.map((relationship) => ({
  value: relationship,
  label: ptBR.enums.relationship[relationship],
}));

export interface GuardianLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GuardianLinkDialog({ open, onOpenChange }: GuardianLinkDialogProps) {
  const { run, pending, fieldErrors } = useApiAction();

  const [guardianId, setGuardianId] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [relationship, setRelationship] = useState<Relationship>('MAE');
  const [canConsent, setCanConsent] = useState(false);
  const [financial, setFinancial] = useState(false);
  const [startDate, setStartDate] = useState(todayIso());
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(undefined);

    const parsed = createGuardianLinkSchema.safeParse({
      guardianId,
      studentId,
      relationship,
      canConsent,
      financial,
      ...(startDate === '' ? {} : { startDate }),
    });

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message);
      return;
    }

    await run(() => createGuardianLink(parsed.data), {
      success: 'Vínculo criado',
      failure: 'Não foi possível criar o vínculo',
      onSuccess: () => {
        setGuardianId(null);
        setStudentId(null);
        setCanConsent(false);
        setFinancial(false);
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title="Novo vínculo"
        description="É o vínculo que abre a agenda e o feed da criança para a família."
        footer={
          <>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={pending}>
                {ptBR.common.cancel}
              </Button>
            </DialogClose>
            <Button type="submit" form="formulario-vinculo" disabled={pending}>
              {pending ? 'Salvando…' : 'Criar vínculo'}
            </Button>
          </>
        }
      >
        <form id="formulario-vinculo" onSubmit={submit} noValidate className="flex flex-col gap-4">
          <Field
            id="vinculo-responsavel"
            label="Responsável"
            required
            error={fieldErrors.guardianId ?? formError}
          >
            <GuardianPicker
              id="vinculo-responsavel"
              value={guardianId}
              onChange={setGuardianId}
              invalid={fieldErrors.guardianId !== undefined}
            />
          </Field>

          <Field id="vinculo-aluno" label="Criança" required error={fieldErrors.studentId}>
            <StudentPicker
              id="vinculo-aluno"
              value={studentId}
              onChange={setStudentId}
              invalid={fieldErrors.studentId !== undefined}
            />
          </Field>

          <Field
            id="vinculo-parentesco"
            label="Parentesco"
            required
            error={fieldErrors.relationship}
          >
            <Select
              id="vinculo-parentesco"
              value={relationship}
              onValueChange={(value) => setRelationship(value as Relationship)}
              options={RELATIONSHIP_OPTIONS}
            />
          </Field>

          <div className="flex flex-col gap-2 rounded-card border border-border p-3">
            <p className="flex items-start gap-2 text-sm text-text-muted">
              <ShieldAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
              Assinar consentimento de LGPD pela criança não é consequência de ser responsável por
              ela. Nasce desmarcado, e marcar é decisão da escola com a família.
            </p>

            <Checkbox
              id="vinculo-consentir"
              label="Pode assinar consentimento pela criança"
              checked={canConsent}
              onCheckedChange={(checked) => setCanConsent(checked === true)}
            />

            <Checkbox
              id="vinculo-financeiro"
              label="Responde pelo financeiro"
              checked={financial}
              onCheckedChange={(checked) => setFinancial(checked === true)}
            />
          </div>

          <Field
            id="vinculo-inicio"
            label="Início da vigência"
            hint="Em branco, a API grava a data de hoje."
            error={fieldErrors.startDate}
          >
            <DatePicker
              id="vinculo-inicio"
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
