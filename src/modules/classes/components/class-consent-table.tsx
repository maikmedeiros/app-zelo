import Link from 'next/link';
import type { Paginated } from '@/shared/api/types';
import { ConsentStateBadge, consentStateOf } from '@/shared/components/consent-badge';
import { DataTable, type Column } from '@/shared/components/data-table';
import { ptBR } from '@/shared/i18n/pt-BR';
import { CONSENT_TYPES } from '@/modules/students/types';
import type { StudentConsentStatusOutput } from '../types';

const columns: Column<StudentConsentStatusOutput>[] = [
  {
    key: 'student',
    header: 'Aluno',
    cell: (row) => (
      <Link
        href={`/students/${row.studentId}/consents`}
        className="font-medium underline-offset-4 hover:underline"
      >
        {row.studentName}
      </Link>
    ),
  },
  ...CONSENT_TYPES.map((type) => ({
    key: type,
    header: ptBR.enums.consentType[type],
    cell: (row: StudentConsentStatusOutput) => (
      <ConsentStateBadge
        state={consentStateOf(row.consents.find((consent) => consent.type === type)?.granted)}
      />
    ),
  })),
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
      emptyTitle="Nenhum aluno nesta situação"
      emptyDescription="O painel de consentimento acompanha os alunos com matrícula vigente na turma."
    />
  );
}
