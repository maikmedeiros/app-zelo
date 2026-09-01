'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/button';
import { DatePicker } from '@/shared/components/date-picker';

const shift = (isoDate: string, days: number): string => {
  const date = new Date(`${isoDate}T12:00:00`);
  date.setDate(date.getDate() + days);

  return date.toISOString().slice(0, 10);
};

export function JournalDatePicker({ date }: { date: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const goTo = (next: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('date', next);
    params.delete('page');

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-end gap-2">
      <Button
        variant="secondary"
        size="sm"
        aria-label="Dia anterior"
        onClick={() => goTo(shift(date, -1))}
      >
        <ChevronLeft aria-hidden className="size-4" />
      </Button>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="agenda-data" className="text-sm font-medium">
          Dia
        </label>
        <DatePicker
          id="agenda-data"
          value={date}
          onChange={(event) => {
            if (event.target.value.length > 0) goTo(event.target.value);
          }}
        />
      </div>

      <Button
        variant="secondary"
        size="sm"
        aria-label="Próximo dia"
        onClick={() => goTo(shift(date, 1))}
      >
        <ChevronRight aria-hidden className="size-4" />
      </Button>
    </div>
  );
}
