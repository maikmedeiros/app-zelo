'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/button';
import { Dialog, DialogClose, DialogContent } from '@/shared/components/dialog';
import { useApiAction } from '@/shared/hooks/use-api-action';
import { ptBR } from '@/shared/i18n/pt-BR';
import { createPerson } from '../api/create-person.client';
import { createPersonSchema } from '../schemas/person-form';
import type { PersonOutput } from '../types';
import { AssignRoleStep } from './assign-role-step';
import { PersonFields, emptyPersonForm, personPayload } from './person-fields';

export interface NewPersonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewPersonDialog({ open, onOpenChange }: NewPersonDialogProps) {
  const { run, pending, fieldErrors } = useApiAction();
  const [form, setForm] = useState(emptyPersonForm);
  const [created, setCreated] = useState<PersonOutput | null>(null);
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(undefined);

    const parsed = createPersonSchema.safeParse(personPayload(form));

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message);
      return;
    }

    await run(
      async () => {
        setCreated(await createPerson(parsed.data));
      },
      { success: 'Pessoa cadastrada', failure: 'Não foi possível cadastrar a pessoa' },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title={created === null ? 'Nova pessoa · etapa 1 de 2' : 'Nova pessoa · etapa 2 de 2'}
        description={
          created === null
            ? 'Primeiro quem a pessoa é. O papel dela na escola vem no passo seguinte.'
            : undefined
        }
        footer={
          created === null ? (
            <>
              <DialogClose asChild>
                <Button type="button" variant="secondary" disabled={pending}>
                  {ptBR.common.cancel}
                </Button>
              </DialogClose>
              <Button type="submit" form="formulario-nova-pessoa" disabled={pending}>
                {pending ? 'Salvando…' : 'Continuar'}
              </Button>
            </>
          ) : undefined
        }
      >
        {created === null ? (
          <form id="formulario-nova-pessoa" onSubmit={submit} noValidate>
            <PersonFields form={form} onChange={setForm} errors={fieldErrors} />

            {formError !== undefined && <p className="mt-3 text-sm text-danger">{formError}</p>}
          </form>
        ) : (
          <AssignRoleStep person={created} onDone={() => onOpenChange(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}
