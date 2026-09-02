'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/button';
import { NewPersonDialog } from './new-person-dialog';

export function NewPersonButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus aria-hidden className="size-4" />
        Nova pessoa
      </Button>

      {open && <NewPersonDialog open={open} onOpenChange={setOpen} />}
    </>
  );
}
