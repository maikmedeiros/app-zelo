import { Badge } from '@/shared/components/badge';
import { Card, CardContent } from '@/shared/components/card';
import { ptBR } from '@/shared/i18n/pt-BR';
import { formatDate } from '@/shared/utils/date';
import { REPORT_DIMENSIONS, isObserved, type ReportDetailOutput, type ReportLevel } from '../types';

const TONE: Record<ReportLevel, 'neutral' | 'accent' | 'brand' | 'success'> = {
  NAO_OBSERVADO: 'neutral',
  EM_INICIO: 'accent',
  EM_DESENVOLVIMENTO: 'brand',
  CONSOLIDADO: 'success',
};

export function ReportReading({ report }: { report: ReportDetailOutput }) {
  const observed = report.items.filter(isObserved);

  return (
    <div data-print="sheet" className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex flex-col gap-1">
          <p className="text-lg font-semibold">{report.studentName}</p>
          <p className="text-text-muted">
            {report.className} · {formatDate(report.periodStart)} a {formatDate(report.periodEnd)}
          </p>
          <p className="text-sm text-text-muted">
            Escrito por {report.authorName}
            {report.publishedAt !== null && ` · publicado em ${formatDate(report.publishedAt)}`}
          </p>
        </CardContent>
      </Card>

      {report.synthesis !== null && (
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Síntese do período</h2>
          <p className="whitespace-pre-wrap">{report.synthesis}</p>
        </section>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">As sete dimensões</h2>

        {observed.length === 0 && (
          <p className="text-text-muted">
            Nenhuma dimensão foi observada neste período. Isso não é atraso: quer dizer que não
            houve situação para observar.
          </p>
        )}

        {REPORT_DIMENSIONS.map((dimension) => {
          const item = report.items.find((candidate) => candidate.dimension === dimension);
          if (item === undefined) return null;

          return (
            <article
              key={dimension}
              className="flex flex-col gap-2 rounded-card border border-border p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-medium">{ptBR.enums.reportDimension[dimension]}</h3>
                <Badge tone={TONE[item.level]}>{ptBR.enums.reportLevel[item.level]}</Badge>
              </div>

              <p className="text-sm text-text-muted">{ptBR.enums.reportLevelHint[item.level]}</p>

              {item.note !== null && <p className="whitespace-pre-wrap">{item.note}</p>}
            </article>
          );
        })}
      </section>
    </div>
  );
}
