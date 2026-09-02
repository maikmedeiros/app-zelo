'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/button';
import { GuardianLinkDialog } from './guardian-link-dialog';

export function NewGuardianLinkButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus aria-hidden className="size-4" />
        Novo vínculo
      </Button>

      {open && <GuardianLinkDialog open={open} onOpenChange={setOpen} />}
    </>
  );
}
