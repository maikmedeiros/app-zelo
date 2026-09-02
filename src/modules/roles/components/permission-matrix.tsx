'use client';

import { Feature } from '@/config/features';
import { SCOPES, type Scope } from '@/shared/auth/session';
import { controlClassName } from '@/shared/components/input';
import { Table, TBody, TableWrapper, Td, Th, THead, Tr } from '@/shared/components/table';
import { ptBR } from '@/shared/i18n/pt-BR';
import type { RolePermissionOutput } from '../types';

const ACTIONS = ['VIEW', 'CREATE', 'UPDATE', 'PUBLISH', 'REVOKE', 'DELETE'] as const;

type Action = (typeof ACTIONS)[number];
type Resource = keyof typeof ptBR.enums.permissionResource;

const NONE = '';

const catalog = (): Map<Resource, Set<Action>> => {
  const map = new Map<Resource, Set<Action>>();

  for (const feature of Object.values(Feature)) {
    const [action, resource] = feature.split(':') as [Action, Resource];
    const actions = map.get(resource) ?? new Set<Action>();

    actions.add(action);
    map.set(resource, actions);
  }

  return map;
};

const CATALOG = [...catalog().entries()].sort(([a], [b]) =>
  ptBR.enums.permissionResource[a].localeCompare(ptBR.enums.permissionResource[b], 'pt-BR'),
);

const featureOf = (action: Action, resource: Resource): Feature =>
  `${action}:${resource}` as Feature;

function ScopeSelect({
  id,
  label,
  value,
  disabled,
  onChange,
}: {
  id: string;
  label: string;
  value: Scope | null;
  disabled: boolean;
  onChange: (scope: Scope | null) => void;
}) {
  return (
    <select
      id={id}
      aria-label={label}
      value={value ?? NONE}
      disabled={disabled}
      onChange={(event) =>
        onChange(event.target.value === NONE ? null : (event.target.value as Scope))
      }
      className={controlClassName(false, 'px-2 py-1 text-sm')}
    >
      <option value={NONE}>—</option>
      {SCOPES.map((scope) => (
        <option key={scope} value={scope}>
          {ptBR.enums.scope[scope]}
        </option>
      ))}
    </select>
  );
}

export function PermissionMatrix({
  permissions,
  disabled = false,
  onChange,
}: {
  permissions: RolePermissionOutput[];
  disabled?: boolean;
  onChange: (permissions: RolePermissionOutput[]) => void;
}) {
  const current = new Map(permissions.map((permission) => [permission.code, permission.scope]));

  const setOne = (feature: Feature, scope: Scope | null) => {
    const next = new Map(current);

    if (scope === null) next.delete(feature);
    else next.set(feature, scope);

    onChange([...next].map(([code, value]) => ({ code, scope: value })));
  };

  const setRow = (resource: Resource, actions: Set<Action>, scope: Scope | null) => {
    const next = new Map(current);

    for (const action of actions) {
      const feature = featureOf(action, resource);
      if (scope === null) next.delete(feature);
      else next.set(feature, scope);
    }

    onChange([...next].map(([code, value]) => ({ code, scope: value })));
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-text-muted">
        {permissions.length === 0
          ? 'Nenhuma permissão: quem tiver este perfil entra e não vê nada.'
          : `${permissions.length} ${permissions.length === 1 ? 'permissão marcada' : 'permissões marcadas'}.`}
      </p>

      <TableWrapper>
        <Table>
          <THead>
            <Tr>
              <Th>Recurso</Th>
              {ACTIONS.map((action) => (
                <Th key={action}>{ptBR.enums.permissionAction[action]}</Th>
              ))}
              <Th>A linha toda</Th>
            </Tr>
          </THead>
          <TBody>
            {CATALOG.map(([resource, actions]) => (
              <Tr key={resource}>
                <Td className="font-medium">{ptBR.enums.permissionResource[resource]}</Td>

                {ACTIONS.map((action) => {
                  if (!actions.has(action)) {
                    return (
                      <Td key={action} className="text-text-muted">
                        —
                      </Td>
                    );
                  }

                  const feature = featureOf(action, resource);

                  return (
                    <Td key={action}>
                      <ScopeSelect
                        id={`permissao-${feature}`}
                        label={`${ptBR.enums.permissionAction[action]} ${ptBR.enums.permissionResource[resource]}`}
                        value={current.get(feature) ?? null}
                        disabled={disabled}
                        onChange={(scope) => setOne(feature, scope)}
                      />
                    </Td>
                  );
                })}

                <Td>
                  <ScopeSelect
                    id={`permissao-linha-${resource}`}
                    label={`Aplicar a todas as ações de ${ptBR.enums.permissionResource[resource]}`}
                    value={null}
                    disabled={disabled}
                    onChange={(scope) => setRow(resource, actions, scope)}
                  />
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </TableWrapper>
    </div>
  );
}
