'use client';

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState, type RefObject } from 'react';
import { cn } from '@/shared/utils/cn';

const OUTPUT_SIZE = 512;
const MAX_ZOOM = 3;

interface Point {
  x: number;
  y: number;
}

export type CropFn = () => Promise<File>;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export interface SquareCropperProps {
  file: File;
  viewport?: number;
  cropRef: RefObject<CropFn | null>;
}

export function SquareCropper({ file, viewport = 256, cropRef }: SquareCropperProps) {
  const [source, setSource] = useState<string | null>(null);
  const [natural, setNatural] = useState<Point | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const dragOrigin = useRef<Point | null>(null);

  // Criar e revogar no mesmo efeito: sob StrictMode o React monta, desmonta e remonta, e o
  // revoke de um efeito separado matava a URL antes de a imagem carregar.
  useEffect(() => {
    const url = URL.createObjectURL(file);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSource(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const baseScale = natural === null ? 1 : viewport / Math.min(natural.x, natural.y);
  const scale = baseScale * zoom;
  const displayed =
    natural === null
      ? { x: viewport, y: viewport }
      : { x: natural.x * scale, y: natural.y * scale };

  const clampOffset = (next: Point, size: Point): Point => ({
    x: clamp(next.x, viewport - size.x, 0),
    y: clamp(next.y, viewport - size.y, 0),
  });

  useEffect(() => {
    if (natural === null) return;

    cropRef.current = async (): Promise<File> => {
      const canvas = document.createElement('canvas');
      canvas.width = OUTPUT_SIZE;
      canvas.height = OUTPUT_SIZE;

      const context = canvas.getContext('2d');
      if (context === null) throw new Error('Canvas indisponível para recortar a imagem.');

      const image = imageRef.current;
      if (image === null) throw new Error('Imagem ainda não carregada.');

      const side = viewport / scale;
      context.drawImage(
        image,
        -offset.x / scale,
        -offset.y / scale,
        side,
        side,
        0,
        0,
        OUTPUT_SIZE,
        OUTPUT_SIZE,
      );

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/jpeg', 0.9),
      );

      if (blob === null) throw new Error('Não foi possível gerar a imagem recortada.');

      return new File([blob], 'foto.jpg', { type: 'image/jpeg' });
    };
  }, [natural, scale, offset, viewport, cropRef]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragOrigin.current = { x: event.clientX - offset.x, y: event.clientY - offset.y };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const origin = dragOrigin.current;
    if (origin === null) return;

    setOffset(clampOffset({ x: event.clientX - origin.x, y: event.clientY - origin.y }, displayed));
  };

  const endDrag = () => {
    dragOrigin.current = null;
  };

  const changeZoom = (next: number) => {
    if (natural === null) return;

    const nextScale = baseScale * next;
    const nextSize = { x: natural.x * nextScale, y: natural.y * nextScale };
    const center = { x: viewport / 2 - offset.x, y: viewport / 2 - offset.y };
    const ratio = nextScale / scale;

    setZoom(next);
    setOffset(
      clampOffset(
        { x: viewport / 2 - center.x * ratio, y: viewport / 2 - center.y * ratio },
        nextSize,
      ),
    );
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{ width: viewport, height: viewport }}
        className={cn(
          'relative touch-none overflow-hidden rounded-full border-2 border-border bg-surface-muted',
          natural !== null && 'cursor-grab active:cursor-grabbing',
        )}
      >
        {source !== null && (
          <img
            ref={imageRef}
            src={source}
            alt="Pré-visualização da foto"
            draggable={false}
            onLoad={(event) => {
              const { naturalWidth, naturalHeight } = event.currentTarget;
              const nextBase = viewport / Math.min(naturalWidth, naturalHeight);

              setNatural({ x: naturalWidth, y: naturalHeight });
              setOffset({
                x: (viewport - naturalWidth * nextBase) / 2,
                y: (viewport - naturalHeight * nextBase) / 2,
              });
            }}
            style={{
              width: displayed.x,
              height: displayed.y,
              transform: `translate(${offset.x}px, ${offset.y}px)`,
            }}
            className="max-w-none origin-top-left select-none"
          />
        )}
      </div>

      <label htmlFor="foto-zoom" className="flex w-full max-w-xs items-center gap-3 text-sm">
        Zoom
        <input
          id="foto-zoom"
          type="range"
          min={1}
          max={MAX_ZOOM}
          step={0.05}
          value={zoom}
          disabled={natural === null}
          onChange={(event) => changeZoom(Number(event.target.value))}
          className="flex-1 accent-brand"
        />
      </label>

      <p className="text-sm text-text-muted">
        Arraste para enquadrar. O recorte é sempre quadrado.
      </p>
    </div>
  );
}
