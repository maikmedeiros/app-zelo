'use client';

import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/button';
import { NewReportDialog } from './new-report-dialog';

export function NewReportButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus aria-hidden className="size-4" />
        Novo relatório
      </Button>

      {open && (
        <NewReportDialog
          open={open}
          onOpenChange={setOpen}
          onCreated={(reportId) => router.push(`/reports/${reportId}`)}
        />
      )}
    </>
  );
}
