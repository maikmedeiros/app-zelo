'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/button';
import { EnrollmentDialog } from './enrollment-dialog';

export interface EnrollStudentButtonProps {
  classId?: string;
  className?: string;
}

export function EnrollStudentButton({ classId, className }: EnrollStudentButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus aria-hidden className="size-4" />
        Matricular aluno
      </Button>

      {open && (
        <EnrollmentDialog
          open={open}
          onOpenChange={setOpen}
          lockedClassId={classId}
          lockedClassName={className}
        />
      )}
    </>
  );
}
