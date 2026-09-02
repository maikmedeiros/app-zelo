'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/button';
import { Dialog, DialogClose, DialogContent } from '@/shared/components/dialog';
import { Field } from '@/shared/components/field';
import { Input } from '@/shared/components/input';
import { useApiAction } from '@/shared/hooks/use-api-action';
import { ptBR } from '@/shared/i18n/pt-BR';
import { PersonPicker } from '@/modules/people/components/person-picker';
import { createUser } from '../api/create-user.client';
import { createUserSchema } from '../schemas/user-form';
import { PasswordField } from './password-field';

export function NewUserButton() {
  const { run, pending, fieldErrors } = useApiAction();
  const [open, setOpen] = useState(false);
  const [personId, setPersonId] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(undefined);

    const parsed = createUserSchema.safeParse({ personId, email, password });

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message);
      return;
    }

    await run(() => createUser(parsed.data), {
      success: 'Conta criada',
      failure: 'Não foi possível criar a conta',
      onSuccess: () => {
        setPersonId(null);
        setEmail('');
        setPassword('');
        setOpen(false);
      },
    });
  };

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus aria-hidden className="size-4" />
        Nova conta
      </Button>

      {open && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent
            title="Nova conta de acesso"
            description="O login pertence a uma pessoa já cadastrada. Quem define a senha inicial é você — ela chega à API e volta como hash."
            footer={
              <>
                <DialogClose asChild>
                  <Button type="button" variant="secondary" disabled={pending}>
                    {ptBR.common.cancel}
                  </Button>
                </DialogClose>
                <Button type="submit" form="formulario-conta" disabled={pending}>
                  {pending ? 'Criando…' : 'Criar conta'}
                </Button>
              </>
            }
          >
            <form
              id="formulario-conta"
              onSubmit={submit}
              noValidate
              className="flex flex-col gap-4"
            >
              <Field id="conta-pessoa" label="Pessoa" required error={fieldErrors.personId}>
                <PersonPicker
                  id="conta-pessoa"
                  value={personId}
                  onChange={setPersonId}
                  invalid={fieldErrors.personId !== undefined}
                />
              </Field>

              <Field id="conta-email" label="E-mail" required error={fieldErrors.email}>
                <Input
                  id="conta-email"
                  type="email"
                  value={email}
                  maxLength={255}
                  autoComplete="off"
                  aria-invalid={fieldErrors.email !== undefined}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </Field>

              <PasswordField
                id="conta-senha"
                label="Senha inicial"
                required
                value={password}
                onChange={setPassword}
                error={fieldErrors.password}
              />

              {formError !== undefined && <p className="text-sm text-danger">{formError}</p>}
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
