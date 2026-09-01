'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/button';
import { StudentFormDialog } from './student-form-dialog';

export function NewStudentButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus aria-hidden className="size-4" />
        Novo aluno
      </Button>

      {open && <StudentFormDialog open={open} onOpenChange={setOpen} />}
    </>
  );
}
