'use client';

import { Select } from '@/shared/components/select';
import { useFindListClasses } from '../api/find-list-classes.client';

export interface ClassPickerProps {
  id: string;
  value: string | null;
  onChange: (classId: string) => void;
  schoolYearId?: string;
  placeholder?: string;
  invalid?: boolean;
}

export function ClassPicker({
  id,
  value,
  onChange,
  schoolYearId,
  placeholder = 'Selecione a turma',
  invalid = false,
}: ClassPickerProps) {
  const classes = useFindListClasses({
    limit: 100,
    ...(schoolYearId === undefined ? {} : { schoolYearId }),
  });

  return (
    <Select
      id={id}
      value={value ?? undefined}
      onValueChange={onChange}
      placeholder={placeholder}
      invalid={invalid}
      options={(classes.data?.results ?? []).map((item) => ({
        value: item.id,
        label: `${item.name} · ${item.schoolYear}`,
      }))}
    />
  );
}
