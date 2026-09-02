'use client';

/* eslint-disable @next/next/no-img-element */

import { Dialog as DialogPrimitive } from 'radix-ui';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/shared/utils/cn';

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export function Gallery({ items, className }: { items: GalleryItem[]; className?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (items.length === 0) return null;

  const current = openIndex === null ? null : (items[openIndex] ?? null);
  const move = (step: number) =>
    setOpenIndex((index) => (index === null ? null : (index + step + items.length) % items.length));

  return (
    <>
      <ul className={cn('grid grid-cols-2 gap-2 sm:grid-cols-3', className)}>
        {items.map((item, index) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              className="block w-full overflow-hidden rounded-control border border-border"
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                width={item.width ?? 400}
                height={item.height ?? 400}
                className="aspect-square w-full object-cover"
              />
            </button>
          </li>
        ))}
      </ul>

      <DialogPrimitive.Root
        open={openIndex !== null}
        onOpenChange={(open) => {
          if (!open) setOpenIndex(null);
        }}
      >
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/85" />
          <DialogPrimitive.Content
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight') move(1);
              if (event.key === 'ArrowLeft') move(-1);
            }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 p-4"
          >
            <DialogPrimitive.Title className="sr-only">Galeria de imagens</DialogPrimitive.Title>

            {current !== null && (
              <img
                src={current.src}
                alt={current.alt}
                width={current.width ?? 1200}
                height={current.height ?? 1200}
                decoding="async"
                className="max-h-[80vh] max-w-full rounded-card object-contain"
              />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Imagem anterior"
                onClick={() => move(-1)}
                className="inline-flex size-11 items-center justify-center rounded-control bg-surface"
              >
                <ChevronLeft aria-hidden className="size-5" />
              </button>

              <span className="text-sm text-white">
                {(openIndex ?? 0) + 1} de {items.length}
              </span>

              <button
                type="button"
                aria-label="Próxima imagem"
                onClick={() => move(1)}
                className="inline-flex size-11 items-center justify-center rounded-control bg-surface"
              >
                <ChevronRight aria-hidden className="size-5" />
              </button>
            </div>

            <DialogPrimitive.Close
              aria-label="Fechar galeria"
              className="absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-control bg-surface"
            >
              <X aria-hidden className="size-5" />
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
