'use client';

import { GraduationCap, IdCard, UserCog } from 'lucide-react';
import { useState } from 'react';
import { Feature } from '@/config/features';
import { hasCapability } from '@/shared/auth/capabilities';
import { useSession } from '@/shared/auth/session-context';
import { Button } from '@/shared/components/button';
import { Field } from '@/shared/components/field';
import { Input } from '@/shared/components/input';
import { Switch } from '@/shared/components/switch';
import { Textarea } from '@/shared/components/textarea';
import { useApiAction } from '@/shared/hooks/use-api-action';
import { cn } from '@/shared/utils/cn';
import { createGuardian } from '@/modules/guardians/api/create-guardian.client';
import { createStudent } from '@/modules/students/api/create-student.client';
import { createTeacher } from '@/modules/teachers/api/create-teacher.client';
import type { PersonOutput } from '../types';

type Role = 'student' | 'guardian' | 'teacher';

const ROLES = [
  {
    role: 'student',
    label: 'Aluno',
    icon: GraduationCap,
    feature: Feature.StudentCreate,
    needsCpf: false,
  },
  {
    role: 'guardian',
    label: 'Responsável',
    icon: IdCard,
    feature: Feature.GuardianCreate,
    needsCpf: true,
  },
  {
    role: 'teacher',
    label: 'Professor',
    icon: UserCog,
    feature: Feature.TeacherCreate,
    needsCpf: true,
  },
] as const;

export interface AssignRoleStepProps {
  person: PersonOutput;
  onDone: () => void;
}

export function AssignRoleStep({ person, onDone }: AssignRoleStepProps) {
  const session = useSession();
  const { run, pending, fieldErrors } = useApiAction();

  const [role, setRole] = useState<Role | null>(null);
  const [code, setCode] = useState('');
  const [notes, setNotes] = useState('');
  const [registration, setRegistration] = useState('');
  const [education, setEducation] = useState('');
  const [receiveEmail, setReceiveEmail] = useState(true);
  const [receivePush, setReceivePush] = useState(true);

  const available = ROLES.filter((item) => hasCapability(session, item.feature));

  const orNull = (value: string): string | null => {
    const trimmed = value.trim();
    return trimmed.length === 0 ? null : trimmed;
  };

  const assign = async () => {
    if (role === null) return;

    const action =
      role === 'student'
        ? () => createStudent({ personId: person.id, code: orNull(code), notes: orNull(notes) })
        : role === 'guardian'
          ? () => createGuardian({ personId: person.id, receiveEmail, receivePush })
          : () =>
              createTeacher({
                personId: person.id,
                registration: orNull(registration),
                education: orNull(education),
              });

    await run(action, {
      success: 'Papel atribuído',
      failure: 'Não foi possível atribuir o papel',
      onSuccess: onDone,
    });
  };

  if (available.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-text-muted">
          {person.name} está cadastrada. Seu perfil não atribui papéis — a coordenação faz esse
          passo.
        </p>
        <Button onClick={onDone} className="self-end">
          Concluir
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-text-muted">
        {person.name} está cadastrada. Falta dizer o que ela é na escola — sem papel, ela só aparece
        na busca por &ldquo;sem papel&rdquo;.
      </p>

      <div className="grid gap-2 sm:grid-cols-3">
        {available.map((item) => {
          const Icon = item.icon;
          const blocked = item.needsCpf && person.cpf === null;

          return (
            <button
              key={item.role}
              type="button"
              disabled={blocked}
              aria-pressed={role === item.role}
              onClick={() => setRole(item.role)}
              className={cn(
                'flex min-h-24 flex-col items-center justify-center gap-2 rounded-card border p-3 text-sm font-medium',
                role === item.role ? 'border-brand bg-brand-soft text-brand' : 'border-border',
                blocked && 'cursor-not-allowed opacity-60',
              )}
            >
              <Icon aria-hidden className="size-5" />
              {item.label}
              {blocked && <span className="text-xs font-normal">exige CPF</span>}
            </button>
          );
        })}
      </div>

      {role === 'student' && (
        <>
          <Field id="papel-codigo" label="Código de matrícula" error={fieldErrors.code}>
            <Input
              id="papel-codigo"
              value={code}
              maxLength={20}
              autoComplete="off"
              onChange={(event) => setCode(event.target.value)}
            />
          </Field>

          <Field id="papel-observacoes" label="Observações" error={fieldErrors.notes}>
            <Textarea
              id="papel-observacoes"
              rows={3}
              value={notes}
              maxLength={2000}
              onChange={(event) => setNotes(event.target.value)}
            />
          </Field>
        </>
      )}

      {role === 'guardian' && (
        <div className="flex flex-col gap-2">
          <Switch
            id="papel-email"
            label="Recebe aviso por e-mail"
            checked={receiveEmail}
            onCheckedChange={setReceiveEmail}
          />
          <Switch
            id="papel-push"
            label="Recebe aviso por notificação"
            checked={receivePush}
            onCheckedChange={setReceivePush}
          />
        </div>
      )}

      {role === 'teacher' && (
        <>
          <Field id="papel-registro" label="Matrícula funcional" error={fieldErrors.registration}>
            <Input
              id="papel-registro"
              value={registration}
              maxLength={30}
              autoComplete="off"
              onChange={(event) => setRegistration(event.target.value)}
            />
          </Field>

          <Field id="papel-formacao" label="Formação" error={fieldErrors.education}>
            <Textarea
              id="papel-formacao"
              rows={3}
              value={education}
              maxLength={2000}
              onChange={(event) => setEducation(event.target.value)}
            />
          </Field>
        </>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="secondary" disabled={pending} onClick={onDone}>
          Concluir sem papel
        </Button>
        <Button disabled={pending || role === null} onClick={() => void assign()}>
          {pending ? 'Salvando…' : 'Atribuir papel'}
        </Button>
      </div>
    </div>
  );
}
