'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/button';
import { ConsentDialog } from './consent-dialog';

export function NewConsentButton({
  studentId,
  studentName,
}: {
  studentId: string;
  studentName: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus aria-hidden className="size-4" />
        Registrar consentimento
      </Button>

      {open && (
        <ConsentDialog
          studentId={studentId}
          studentName={studentName}
          open={open}
          onOpenChange={setOpen}
        />
      )}
    </>
  );
}
