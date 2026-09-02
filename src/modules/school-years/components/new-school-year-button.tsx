'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/button';
import { SchoolYearDialog } from './school-year-dialog';

export function NewSchoolYearButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus aria-hidden className="size-4" />
        Novo ano letivo
      </Button>

      {open && <SchoolYearDialog open={open} onOpenChange={setOpen} />}
    </>
  );
}
