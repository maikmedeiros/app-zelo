'use client';

import { Select } from '@/shared/components/select';
import { ALL } from '@/shared/hooks/use-url-filters';
import { useFindListRoles } from '../api/find-list-roles.client';

export function RolePicker({
  id,
  value,
  onChange,
  emptyLabel,
  placeholder = 'Selecione o perfil',
  invalid = false,
}: {
  id: string;
  value: string | null;
  onChange: (roleId: string | null) => void;
  emptyLabel?: string;
  placeholder?: string;
  invalid?: boolean;
}) {
  const roles = useFindListRoles({ limit: 100 });

  const options = (roles.data?.results ?? []).map((role) => ({
    value: role.id,
    label: role.name,
  }));

  return (
    <Select
      id={id}
      value={value ?? (emptyLabel === undefined ? undefined : ALL)}
      onValueChange={(next) => onChange(next === ALL ? null : next)}
      placeholder={placeholder}
      invalid={invalid}
      options={emptyLabel === undefined ? options : [{ value: ALL, label: emptyLabel }, ...options]}
    />
  );
}
