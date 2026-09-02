'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/button';
import { DatePicker } from '@/shared/components/date-picker';
import { Dialog, DialogClose, DialogContent } from '@/shared/components/dialog';
import { Field } from '@/shared/components/field';
import { useApiAction } from '@/shared/hooks/use-api-action';
import { ptBR } from '@/shared/i18n/pt-BR';
import { todayIso } from '@/shared/utils/date';
import { RolePicker } from '@/modules/roles/components/role-picker';
import { UserPicker } from '@/modules/users/components/user-picker';
import { createRoleGrant } from '../api/create-role-grant.client';
import { createRoleGrantSchema } from '../schemas/role-grant-form';

export function RoleGrantDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { run, pending, fieldErrors } = useApiAction();

  const [userId, setUserId] = useState<string | null>(null);
  const [roleId, setRoleId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(todayIso());
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(undefined);

    const parsed = createRoleGrantSchema.safeParse({
      userId,
      roleId,
      ...(startDate === '' ? {} : { startDate }),
    });

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message);
      return;
    }

    await run(() => createRoleGrant(parsed.data), {
      success: 'Perfil concedido',
      failure: 'Não foi possível conceder',
      onSuccess: () => {
        setUserId(null);
        setRoleId(null);
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title="Conceder perfil"
        description="A conta passa a ter as permissões do perfil na próxima vez que entrar. Quem concede fica registrado."
        footer={
          <>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={pending}>
                {ptBR.common.cancel}
              </Button>
            </DialogClose>
            <Button type="submit" form="formulario-concessao" disabled={pending}>
              {pending ? 'Concedendo…' : 'Conceder'}
            </Button>
          </>
        }
      >
        <form
          id="formulario-concessao"
          onSubmit={submit}
          noValidate
          className="flex flex-col gap-4"
        >
          <Field
            id="concessao-conta"
            label="Conta"
            required
            error={fieldErrors.userId ?? formError}
          >
            <UserPicker
              id="concessao-conta"
              value={userId}
              onChange={setUserId}
              invalid={fieldErrors.userId !== undefined}
            />
          </Field>

          <Field id="concessao-perfil" label="Perfil" required error={fieldErrors.roleId}>
            <RolePicker
              id="concessao-perfil"
              value={roleId}
              onChange={setRoleId}
              invalid={fieldErrors.roleId !== undefined}
            />
          </Field>

          <Field
            id="concessao-inicio"
            label="Início da vigência"
            hint="Em branco, a API grava a data de hoje."
            error={fieldErrors.startDate}
          >
            <DatePicker
              id="concessao-inicio"
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
