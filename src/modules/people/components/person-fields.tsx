'use client';

import { DatePicker } from '@/shared/components/date-picker';
import { Field } from '@/shared/components/field';
import { Input } from '@/shared/components/input';
import { maskCpf } from '@/shared/utils/cpf';
import type { PersonOutput } from '../types';

export interface PersonFormState {
  name: string;
  socialName: string;
  birthDate: string;
  cpf: string;
  phone: string;
  contactEmail: string;
}

export const emptyPersonForm: PersonFormState = {
  name: '',
  socialName: '',
  birthDate: '',
  cpf: '',
  phone: '',
  contactEmail: '',
};

export const personFormFrom = (person: PersonOutput): PersonFormState => ({
  name: person.name,
  socialName: person.socialName ?? '',
  birthDate: person.birthDate ?? '',
  cpf: person.cpf === null ? '' : maskCpf(person.cpf),
  phone: person.phone ?? '',
  contactEmail: person.contactEmail ?? '',
});

const orNull = (value: string): string | null => {
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
};

export const personPayload = (form: PersonFormState) => ({
  name: form.name.trim(),
  socialName: orNull(form.socialName),
  birthDate: orNull(form.birthDate),
  cpf: orNull(form.cpf),
  phone: orNull(form.phone),
  contactEmail: orNull(form.contactEmail),
});

export interface PersonFieldsProps {
  form: PersonFormState;
  onChange: (form: PersonFormState) => void;
  errors: Record<string, string>;
}

export function PersonFields({ form, onChange, errors }: PersonFieldsProps) {
  const set = <Key extends keyof PersonFormState>(key: Key, value: string) =>
    onChange({ ...form, [key]: value });

  return (
    <div className="flex flex-col gap-4">
      <Field id="pessoa-nome" label="Nome completo" required error={errors.name}>
        <Input
          id="pessoa-nome"
          value={form.name}
          maxLength={200}
          autoComplete="off"
          aria-invalid={errors.name !== undefined}
          onChange={(event) => set('name', event.target.value)}
        />
      </Field>

      <Field
        id="pessoa-nome-social"
        label="Nome social"
        hint="Como a pessoa quer ser chamada, quando difere do registro."
        error={errors.socialName}
      >
        <Input
          id="pessoa-nome-social"
          value={form.socialName}
          maxLength={200}
          autoComplete="off"
          aria-invalid={errors.socialName !== undefined}
          onChange={(event) => set('socialName', event.target.value)}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="pessoa-nascimento" label="Nascimento" error={errors.birthDate}>
          <DatePicker
            id="pessoa-nascimento"
            value={form.birthDate}
            aria-invalid={errors.birthDate !== undefined}
            onChange={(event) => set('birthDate', event.target.value)}
          />
        </Field>

        <Field
          id="pessoa-cpf"
          label="CPF"
          hint="Obrigatório para responsável e professor."
          error={errors.cpf}
        >
          <Input
            id="pessoa-cpf"
            value={form.cpf}
            inputMode="numeric"
            placeholder="000.000.000-00"
            autoComplete="off"
            aria-invalid={errors.cpf !== undefined}
            onChange={(event) => set('cpf', maskCpf(event.target.value))}
          />
        </Field>

        <Field id="pessoa-telefone" label="Telefone" error={errors.phone}>
          <Input
            id="pessoa-telefone"
            value={form.phone}
            type="tel"
            maxLength={20}
            autoComplete="off"
            aria-invalid={errors.phone !== undefined}
            onChange={(event) => set('phone', event.target.value)}
          />
        </Field>

        <Field id="pessoa-email" label="E-mail de contato" error={errors.contactEmail}>
          <Input
            id="pessoa-email"
            value={form.contactEmail}
            type="email"
            maxLength={255}
            autoComplete="off"
            aria-invalid={errors.contactEmail !== undefined}
            onChange={(event) => set('contactEmail', event.target.value)}
          />
        </Field>
      </div>
    </div>
  );
}
