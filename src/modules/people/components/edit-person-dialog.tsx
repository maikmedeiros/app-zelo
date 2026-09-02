'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/button';
import { Dialog, DialogClose, DialogContent } from '@/shared/components/dialog';
import { useApiAction } from '@/shared/hooks/use-api-action';
import { ptBR } from '@/shared/i18n/pt-BR';
import { updatePerson } from '../api/update-person.client';
import { updatePersonSchema } from '../schemas/person-form';
import type { PersonOutput } from '../types';
import { PersonFields, personFormFrom, personPayload, type PersonFormState } from './person-fields';

const changedFields = (person: PersonOutput, form: PersonFormState) => {
  const next = personPayload(form);

  return {
    ...(next.name === person.name ? {} : { name: next.name }),
    ...(next.socialName === person.socialName ? {} : { socialName: next.socialName }),
    ...(next.birthDate === person.birthDate ? {} : { birthDate: next.birthDate }),
    ...(next.cpf === null && person.cpf === null ? {} : { cpf: next.cpf }),
    ...(next.phone === person.phone ? {} : { phone: next.phone }),
    ...(next.contactEmail === person.contactEmail ? {} : { contactEmail: next.contactEmail }),
  };
};

export interface EditPersonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  person: PersonOutput;
}

export function EditPersonDialog({ open, onOpenChange, person }: EditPersonDialogProps) {
  const { run, pending, fieldErrors } = useApiAction();
  const [form, setForm] = useState(() => personFormFrom(person));
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(undefined);

    const parsed = updatePersonSchema.safeParse(changedFields(person, form));

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message);
      return;
    }

    await run(() => updatePerson(person.id, parsed.data), {
      success: 'Cadastro atualizado',
      failure: 'Não foi possível salvar o cadastro',
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title={`Editar ${person.name}`}
        description="Campo em branco apaga o valor: corrigir um telefone errado é apagá-lo."
        footer={
          <>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={pending}>
                {ptBR.common.cancel}
              </Button>
            </DialogClose>
            <Button type="submit" form="formulario-pessoa" disabled={pending}>
              {pending ? 'Salvando…' : 'Salvar'}
            </Button>
          </>
        }
      >
        <form id="formulario-pessoa" onSubmit={submit} noValidate>
          <PersonFields form={form} onChange={setForm} errors={fieldErrors} />

          {formError !== undefined && <p className="mt-3 text-sm text-danger">{formError}</p>}
        </form>
      </DialogContent>
    </Dialog>
  );
}
