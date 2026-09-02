'use client';

import { Pencil, Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/button';
import { TeacherFormDialog } from './teacher-form-dialog';
import type { TeacherOutput } from '../types';

export function NewTeacherButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus aria-hidden className="size-4" />
        Novo professor
      </Button>

      {open && <TeacherFormDialog open={open} onOpenChange={setOpen} />}
    </>
  );
}

export function EditTeacherButton({ teacher }: { teacher: TeacherOutput }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>
        <Pencil aria-hidden className="size-4" />
        Editar
      </Button>

      {open && <TeacherFormDialog open={open} onOpenChange={setOpen} teacher={teacher} />}
    </>
  );
}
