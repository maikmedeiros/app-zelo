'use client';

import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/button';
import { NewReportTemplateDialog } from './new-report-template-dialog';

export function NewReportTemplateButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus aria-hidden className="size-4" />
        Novo modelo
      </Button>

      {open && (
        <NewReportTemplateDialog
          open={open}
          onOpenChange={setOpen}
          onCreated={(templateId) => router.push(`/report-templates/${templateId}`)}
        />
      )}
    </>
  );
}
