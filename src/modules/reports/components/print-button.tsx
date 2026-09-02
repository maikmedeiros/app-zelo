'use client';

import { Printer } from 'lucide-react';
import { Button } from '@/shared/components/button';

export function PrintButton() {
  return (
    <Button variant="secondary" size="sm" onClick={() => window.print()}>
      <Printer aria-hidden className="size-4" />
      Imprimir
    </Button>
  );
}
