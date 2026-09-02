'use client';

import { CalendarX, MoreVertical, Pencil } from 'lucide-react';
import { useState } from 'react';
import { Feature } from '@/config/features';
import { useCan } from '@/shared/auth/session-context';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/shared/components/alert-dialog';
import { Button } from '@/shared/components/button';
import { Checkbox } from '@/shared/components/checkbox';
import { Dialog, DialogClose, DialogContent } from '@/shared/components/dialog';
import { Field } from '@/shared/components/field';
import { Select } from '@/shared/components/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/dropdown-menu';
import { useApiAction } from '@/shared/hooks/use-api-action';
import { ptBR } from '@/shared/i18n/pt-BR';
import { revokeGuardianLink } from '../api/revoke-guardian-link.client';
import { updateGuardianLink } from '../api/update-guardian-link.client';
import { updateGuardianLinkSchema } from '../schemas/guardian-link-form';
import { RELATIONSHIPS, isCurrent, type GuardianLinkOutput, type Relationship } from '../types';

const RELATIONSHIP_OPTIONS = RELATIONSHIPS.map((relationship) => ({
  value: relationship,
  label: ptBR.enums.relationship[relationship],
}));

export function GuardianLinkActions({ link }: { link: GuardianLinkOutput }) {
  const { run, pending, fieldErrors } = useApiAction();
  const canUpdate = useCan(Feature.GuardianLinkUpdate);
  const canRevoke = useCan(Feature.GuardianLinkRevoke);

  const [editing, setEditing] = useState(false);
  const [relationship, setRelationship] = useState<Relationship>(link.relationship);
  const [canConsent, setCanConsent] = useState(link.canConsent);
  const [financial, setFinancial] = useState(link.financial);
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const current = isCurrent(link);

  if (!current || (!canUpdate && !canRevoke)) return null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(undefined);

    const parsed = updateGuardianLinkSchema.safeParse({
      ...(relationship === link.relationship ? {} : { relationship }),
      ...(canConsent === link.canConsent ? {} : { canConsent }),
      ...(financial === link.financial ? {} : { financial }),
    });

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message);
      return;
    }

    await run(() => updateGuardianLink(link.id, parsed.data), {
      success: 'Vínculo atualizado',
      failure: 'Não foi possível salvar o vínculo',
      onSuccess: () => setEditing(false),
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`Ações do vínculo de ${link.guardianName} com ${link.studentName}`}
          className="inline-flex size-11 items-center justify-center rounded-control hover:bg-surface-muted"
        >
          <MoreVertical aria-hidden className="size-5" />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          {canUpdate && (
            <DropdownMenuItem onSelect={() => setEditing(true)}>
              <Pencil aria-hidden className="size-4" />
              Editar
            </DropdownMenuItem>
          )}

          {canRevoke && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                  <CalendarX aria-hidden className="size-4" />
                  Encerrar vínculo
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent
                title={`Encerrar o vínculo de ${link.guardianName}?`}
                description={`A família perde o acesso à agenda e ao feed de ${link.studentName}. Nada é apagado: o vínculo encerrado é o que explica as postagens que ela já viu.`}
                confirmLabel="Encerrar"
                pending={pending}
                onConfirm={() =>
                  void run(() => revokeGuardianLink(link.id), {
                    success: 'Vínculo encerrado',
                    failure: 'Não foi possível encerrar o vínculo',
                  })
                }
              />
            </AlertDialog>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {editing && (
        <Dialog open={editing} onOpenChange={setEditing}>
          <DialogContent
            title={`${link.guardianName} e ${link.studentName}`}
            description="Trocar o responsável ou a criança não é editar: é encerrar este vínculo e criar outro."
            footer={
              <>
                <DialogClose asChild>
                  <Button type="button" variant="secondary" disabled={pending}>
                    {ptBR.common.cancel}
                  </Button>
                </DialogClose>
                <Button type="submit" form="formulario-editar-vinculo" disabled={pending}>
                  {pending ? 'Salvando…' : 'Salvar'}
                </Button>
              </>
            }
          >
            <form
              id="formulario-editar-vinculo"
              onSubmit={submit}
              noValidate
              className="flex flex-col gap-4"
            >
              <Field
                id="editar-parentesco"
                label="Parentesco"
                required
                error={fieldErrors.relationship}
              >
                <Select
                  id="editar-parentesco"
                  value={relationship}
                  onValueChange={(value) => setRelationship(value as Relationship)}
                  options={RELATIONSHIP_OPTIONS}
                />
              </Field>

              <Checkbox
                id="editar-consentir"
                label="Pode assinar consentimento pela criança"
                checked={canConsent}
                onCheckedChange={(checked) => setCanConsent(checked === true)}
              />

              <Checkbox
                id="editar-financeiro"
                label="Responde pelo financeiro"
                checked={financial}
                onCheckedChange={(checked) => setFinancial(checked === true)}
              />

              {formError !== undefined && <p className="text-sm text-danger">{formError}</p>}
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
