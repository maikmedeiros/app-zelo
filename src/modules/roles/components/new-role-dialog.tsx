'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/button';
import { Dialog, DialogClose, DialogContent } from '@/shared/components/dialog';
import { Field } from '@/shared/components/field';
import { Input } from '@/shared/components/input';
import { Textarea } from '@/shared/components/textarea';
import { useApiAction } from '@/shared/hooks/use-api-action';
import { ptBR } from '@/shared/i18n/pt-BR';
import { createRole } from '../api/create-role.client';
import { createRoleSchema } from '../schemas/role-form';

export function NewRoleDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (roleId: string) => void;
}) {
  const { run, pending, fieldErrors } = useApiAction();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(undefined);

    const parsed = createRoleSchema.safeParse({
      code,
      name,
      description: description.trim() === '' ? null : description,
      permissions: [],
    });

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message);
      return;
    }

    await run(
      async () => {
        const role = await createRole(parsed.data);
        onCreated(role.id);
      },
      {
        success: 'Perfil criado',
        failure: 'Não foi possível criar o perfil',
        onSuccess: () => onOpenChange(false),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title="Novo perfil"
        description="O perfil nasce sem permissão nenhuma. As permissões se marcam na tela seguinte."
        footer={
          <>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={pending}>
                {ptBR.common.cancel}
              </Button>
            </DialogClose>
            <Button type="submit" form="formulario-perfil" disabled={pending}>
              {pending ? 'Criando…' : 'Criar perfil'}
            </Button>
          </>
        }
      >
        <form id="formulario-perfil" onSubmit={submit} noValidate className="flex flex-col gap-4">
          <Field
            id="perfil-novo-codigo"
            label="Código"
            hint="MAIÚSCULAS_COM_UNDERSCORE. É a chave permanente do perfil — não muda depois."
            required
            error={fieldErrors.code ?? formError}
          >
            <Input
              id="perfil-novo-codigo"
              value={code}
              maxLength={40}
              aria-invalid={fieldErrors.code !== undefined}
              onChange={(event) => setCode(event.target.value.toUpperCase())}
            />
          </Field>

          <Field id="perfil-novo-nome" label="Nome" required error={fieldErrors.name}>
            <Input
              id="perfil-novo-nome"
              value={name}
              maxLength={120}
              aria-invalid={fieldErrors.name !== undefined}
              onChange={(event) => setName(event.target.value)}
            />
          </Field>

          <Field
            id="perfil-nova-descricao"
            label="Descrição"
            hint="Quem usa este perfil, e por quê."
            error={fieldErrors.description}
          >
            <Textarea
              id="perfil-nova-descricao"
              rows={3}
              maxLength={2000}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </Field>
        </form>
      </DialogContent>
    </Dialog>
  );
}
