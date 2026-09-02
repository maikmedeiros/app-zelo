'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/button';
import { RoleGrantDialog } from './role-grant-dialog';

export function NewRoleGrantButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus aria-hidden className="size-4" />
        Conceder perfil
      </Button>

      {open && <RoleGrantDialog open={open} onOpenChange={setOpen} />}
    </>
  );
}
