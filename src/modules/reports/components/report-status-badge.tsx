import { Badge } from '@/shared/components/badge';
import { ptBR } from '@/shared/i18n/pt-BR';
import type { ReportStatus } from '../types';

export function ReportStatusBadge({ status }: { status: ReportStatus }) {
  return (
    <Badge tone={status === 'PUBLICADO' ? 'success' : 'neutral'}>
      {ptBR.enums.reportStatus[status]}
    </Badge>
  );
}
