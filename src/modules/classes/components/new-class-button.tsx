'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/button';
import { ClassFormDialog } from './class-form-dialog';

export function NewClassButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus aria-hidden className="size-4" />
        Nova turma
      </Button>

      {open && <ClassFormDialog open={open} onOpenChange={setOpen} />}
    </>
  );
}
