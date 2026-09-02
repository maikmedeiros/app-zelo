'use client';

import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { Feature } from '@/config/features';
import { useCan } from '@/shared/auth/session-context';
import { Button } from '@/shared/components/button';
import { EditPersonDialog } from './edit-person-dialog';
import type { PersonOutput } from '../types';

export function EditPersonButton({ person }: { person: PersonOutput }) {
  const [open, setOpen] = useState(false);
  const canUpdate = useCan(Feature.PersonUpdate);

  if (!canUpdate) return null;

  return (
    <>
      <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>
        <Pencil aria-hidden className="size-4" />
        Editar
      </Button>

      {open && <EditPersonDialog open={open} onOpenChange={setOpen} person={person} />}
    </>
  );
}
