'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/button';
import { Dialog, DialogClose, DialogContent } from '@/shared/components/dialog';
import { Field } from '@/shared/components/field';
import { Switch } from '@/shared/components/switch';
import { useApiAction } from '@/shared/hooks/use-api-action';
import { ptBR } from '@/shared/i18n/pt-BR';
import { PersonPicker } from '@/modules/people/components/person-picker';
import { createGuardian } from '../api/create-guardian.client';
import { createGuardianSchema } from '../schemas/guardian-form';

export function NewGuardianButton() {
  const { run, pending, fieldErrors } = useApiAction();
  const [open, setOpen] = useState(false);
  const [personId, setPersonId] = useState<string | null>(null);
  const [receiveEmail, setReceiveEmail] = useState(true);
  const [receivePush, setReceivePush] = useState(true);
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(undefined);

    const parsed = createGuardianSchema.safeParse({ personId, receiveEmail, receivePush });

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message);
      return;
    }

    await run(() => createGuardian(parsed.data), {
      success: 'Responsável cadastrado',
      failure: 'Não foi possível cadastrar o responsável',
      onSuccess: () => {
        setPersonId(null);
        setOpen(false);
      },
    });
  };

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus aria-hidden className="size-4" />
        Novo responsável
      </Button>

      {open && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent
            title="Novo responsável"
            description="A pessoa já precisa estar cadastrada e ter CPF — é o CPF que impede a família duplicada."
            footer={
              <>
                <DialogClose asChild>
                  <Button type="button" variant="secondary" disabled={pending}>
                    {ptBR.common.cancel}
                  </Button>
                </DialogClose>
                <Button type="submit" form="formulario-responsavel" disabled={pending}>
                  {pending ? 'Salvando…' : 'Salvar'}
                </Button>
              </>
            }
          >
            <form
              id="formulario-responsavel"
              onSubmit={submit}
              noValidate
              className="flex flex-col gap-4"
            >
              <Field
                id="responsavel-pessoa"
                label="Pessoa"
                required
                error={fieldErrors.personId ?? formError}
              >
                <PersonPicker
                  id="responsavel-pessoa"
                  value={personId}
                  onChange={setPersonId}
                  invalid={fieldErrors.personId !== undefined}
                />
              </Field>

              <Switch
                id="responsavel-email"
                label="Recebe aviso por e-mail"
                checked={receiveEmail}
                onCheckedChange={setReceiveEmail}
              />
              <Switch
                id="responsavel-push"
                label="Recebe aviso por notificação"
                checked={receivePush}
                onCheckedChange={setReceivePush}
              />
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
