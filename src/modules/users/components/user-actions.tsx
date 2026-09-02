'use client';

import { KeyRound, Power } from 'lucide-react';
import { useState } from 'react';
import { Feature } from '@/config/features';
import { useCan, useSession } from '@/shared/auth/session-context';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/shared/components/alert-dialog';
import { Button } from '@/shared/components/button';
import { Dialog, DialogClose, DialogContent } from '@/shared/components/dialog';
import { Field } from '@/shared/components/field';
import { Input } from '@/shared/components/input';
import { useApiAction } from '@/shared/hooks/use-api-action';
import { ptBR } from '@/shared/i18n/pt-BR';
import { deleteUser } from '../api/delete-user.client';
import { updateUser } from '../api/update-user.client';
import { updateUserSchema } from '../schemas/user-form';
import type { UserAccountOutput } from '../types';
import { PasswordField } from './password-field';

export function UserActions({ user }: { user: UserAccountOutput }) {
  const session = useSession();
  const { run, pending, fieldErrors } = useApiAction();
  const canUpdate = useCan(Feature.UserUpdate);
  const canDelete = useCan(Feature.UserDelete);

  const [editing, setEditing] = useState(false);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const isSelf = user.id === session.id;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(undefined);

    const parsed = updateUserSchema.safeParse({
      ...(email.trim().toLowerCase() === user.email ? {} : { email: email.trim() }),
      ...(password.length === 0 ? {} : { password }),
    });

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message);
      return;
    }

    await run(() => updateUser(user.id, parsed.data), {
      success: 'Conta atualizada',
      failure: 'Não foi possível atualizar a conta',
      onSuccess: () => {
        setPassword('');
        setEditing(false);
      },
    });
  };

  if (!canUpdate && !canDelete) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canUpdate && (
        <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>
          <KeyRound aria-hidden className="size-4" />
          E-mail e senha
        </Button>
      )}

      {canUpdate && !user.active && (
        <Button
          size="sm"
          disabled={pending}
          onClick={() =>
            void run(() => updateUser(user.id, { active: true }), {
              success: 'Conta reativada',
              failure: 'Não foi possível reativar a conta',
            })
          }
        >
          <Power aria-hidden className="size-4" />
          Reativar
        </Button>
      )}

      {canDelete && user.active && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="danger" disabled={pending || isSelf}>
              <Power aria-hidden className="size-4" />
              Desativar
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent
            title={`Desativar a conta de ${user.personName}?`}
            description="O login para de funcionar e os acessos a turma são encerrados. A conta não é apagada: postagens e consentimentos registrados por ela continuam existindo."
            confirmLabel="Desativar"
            pending={pending}
            onConfirm={() =>
              void run(() => deleteUser(user.id), {
                success: 'Conta desativada',
                failure: 'Não foi possível desativar a conta',
              })
            }
          />
        </AlertDialog>
      )}

      {isSelf && canDelete && user.active && (
        <p className="text-sm text-text-muted">A própria conta não pode ser desativada.</p>
      )}

      {editing && (
        <Dialog open={editing} onOpenChange={setEditing}>
          <DialogContent
            title={`Acesso de ${user.personName}`}
            description="Deixe a senha em branco para manter a atual."
            footer={
              <>
                <DialogClose asChild>
                  <Button type="button" variant="secondary" disabled={pending}>
                    {ptBR.common.cancel}
                  </Button>
                </DialogClose>
                <Button type="submit" form="formulario-acesso" disabled={pending}>
                  {pending ? 'Salvando…' : 'Salvar'}
                </Button>
              </>
            }
          >
            <form
              id="formulario-acesso"
              onSubmit={submit}
              noValidate
              className="flex flex-col gap-4"
            >
              <Field id="acesso-email" label="E-mail" required error={fieldErrors.email}>
                <Input
                  id="acesso-email"
                  type="email"
                  value={email}
                  maxLength={255}
                  autoComplete="off"
                  aria-invalid={fieldErrors.email !== undefined}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </Field>

              <PasswordField
                id="acesso-senha"
                label="Nova senha"
                value={password}
                onChange={setPassword}
                error={fieldErrors.password}
                hint="Em branco, a senha atual continua valendo."
              />

              {formError !== undefined && <p className="text-sm text-danger">{formError}</p>}
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
