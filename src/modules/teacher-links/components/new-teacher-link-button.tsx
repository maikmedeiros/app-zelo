'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/button';
import { TeacherLinkDialog } from './teacher-link-dialog';

export function NewTeacherLinkButton({ classId }: { classId?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus aria-hidden className="size-4" />
        Novo vínculo
      </Button>

      {open && <TeacherLinkDialog open={open} onOpenChange={setOpen} lockedClassId={classId} />}
    </>
  );
}
