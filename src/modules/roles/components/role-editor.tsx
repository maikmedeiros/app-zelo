'use client';

import { Lock } from 'lucide-react';
import { useState } from 'react';
import { Feature } from '@/config/features';
import { useCan } from '@/shared/auth/session-context';
import { Button } from '@/shared/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/card';
import { Field } from '@/shared/components/field';
import { Input } from '@/shared/components/input';
import { Textarea } from '@/shared/components/textarea';
import { useApiAction } from '@/shared/hooks/use-api-action';
import { updateRole } from '../api/update-role.client';
import { updateRoleSchema } from '../schemas/role-form';
import { PermissionMatrix } from './permission-matrix';
import type { RoleOutput, RolePermissionOutput } from '../types';

export function RoleEditor({ role }: { role: RoleOutput }) {
  const { run, pending, fieldErrors } = useApiAction();
  const canUpdate = useCan(Feature.RoleUpdate);

  const editable = canUpdate && !role.system;

  const [name, setName] = useState(role.name);
  const [description, setDescription] = useState(role.description ?? '');
  const [permissions, setPermissions] = useState<RolePermissionOutput[]>(role.permissions);
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(undefined);

    const parsed = updateRoleSchema.safeParse({
      name,
      description: description.trim() === '' ? null : description,
      permissions,
    });

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message);
      return;
    }

    await run(() => updateRole(role.id, parsed.data), {
      success: 'Perfil salvo',
      failure: 'Não foi possível salvar o perfil',
    });
  };

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-6">
      {role.system && (
        <p className="flex items-start gap-2 rounded-card border border-border p-3 text-sm text-text-muted">
          <Lock aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
          Perfil de sistema: nasce de migration, não da API, e por isso não se edita aqui. Para uma
          variação, crie um perfil da escola com as permissões que quiser.
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Identificação</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Field
            id="perfil-codigo"
            label="Código"
            hint="É a chave que o resto do sistema usa para falar do perfil. Não muda depois de criado."
          >
            <Input id="perfil-codigo" value={role.code} disabled readOnly />
          </Field>

          <Field id="perfil-nome" label="Nome" required error={fieldErrors.name}>
            <Input
              id="perfil-nome"
              value={name}
              maxLength={120}
              disabled={!editable}
              aria-invalid={fieldErrors.name !== undefined}
              onChange={(event) => setName(event.target.value)}
            />
          </Field>

          <Field id="perfil-descricao" label="Descrição" error={fieldErrors.description}>
            <Textarea
              id="perfil-descricao"
              rows={3}
              maxLength={2000}
              value={description}
              disabled={!editable}
              onChange={(event) => setDescription(event.target.value)}
            />
          </Field>
        </CardContent>
      </Card>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Permissões</h2>
          <p className="text-text-muted">
            Salvar <strong>substitui o conjunto inteiro</strong>. É assim que se remove uma
            permissão: deixando-a em “—” antes de salvar.
          </p>
        </div>

        <PermissionMatrix
          permissions={permissions}
          disabled={!editable}
          onChange={setPermissions}
        />
      </section>

      {formError !== undefined && (
        <p role="alert" className="text-sm text-danger">
          {formError}
        </p>
      )}

      {editable && (
        <div>
          <Button type="submit" disabled={pending}>
            {pending ? 'Salvando…' : 'Salvar perfil'}
          </Button>
        </div>
      )}
    </form>
  );
}
