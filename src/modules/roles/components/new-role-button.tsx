'use client';

import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/button';
import { NewRoleDialog } from './new-role-dialog';

export function NewRoleButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus aria-hidden className="size-4" />
        Novo perfil
      </Button>

      {open && (
        <NewRoleDialog
          open={open}
          onOpenChange={setOpen}
          onCreated={(roleId) => router.push(`/roles/${roleId}`)}
        />
      )}
    </>
  );
}
