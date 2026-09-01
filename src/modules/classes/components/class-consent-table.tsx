import Link from 'next/link';
import type { Paginated } from '@/shared/api/types';
import { ConsentBadge } from '@/shared/components/consent-badge';
import { DataTable, type Column } from '@/shared/components/data-table';
import { CONSENT_TYPES, type ConsentStateOutput, type StudentConsentStatusOutput } from '../types';

const stateOf = (consent: ConsentStateOutput | undefined) => {
  if (consent === undefined || consent.granted === null) return 'missing' as const;
  return consent.granted ? ('granted' as const) : ('denied' as const);
};

const columns: Column<StudentConsentStatusOutput>[] = [
  {
    key: 'student',
    header: 'Aluno',
    cell: (row) => (
      <Link
        href={`/students/${row.studentId}`}
        className="font-medium underline-offset-4 hover:underline"
      >
        {row.studentName}
      </Link>
    ),
  },
  {
    key: 'consents',
    header: 'Consentimentos vigentes',
    cell: (row) => (
      <span className="flex flex-wrap gap-1.5">
        {CONSENT_TYPES.map((type) => (
          <ConsentBadge
            key={type}
            type={type}
            state={stateOf(row.consents.find((consent) => consent.type === type))}
          />
        ))}
      </span>
    ),
  },
];

export function ClassConsentTable({
  consents,
}: {
  consents: Paginated<StudentConsentStatusOutput>;
}) {
  return (
    <DataTable
      data={consents}
      columns={columns}
      rowKey={(row) => row.studentId}
      emptyTitle="Nenhum aluno matriculado"
      emptyDescription="O painel de consentimento acompanha os alunos com matrícula vigente na turma."
    />
  );
}
