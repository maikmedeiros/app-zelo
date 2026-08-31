'use client';

import { ImagePlus } from 'lucide-react';
import { useId, useRef, useState, type DragEvent } from 'react';
import { publicEnv } from '@/config/env.public';
import { cn } from '@/shared/utils/cn';

const ACCEPTED = publicEnv.acceptedImageMimeTypes;

const megabytes = (bytes: number): string =>
  `${(bytes / 1_048_576).toLocaleString('pt-BR', { maximumFractionDigits: 0 })} MB`;

export interface FileDropzoneProps {
  onFiles: (files: File[]) => void;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FileDropzone({
  onFiles,
  multiple = false,
  disabled = false,
  className,
}: FileDropzoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accept = (list: FileList | null) => {
    if (list === null) return;

    const files = [...list];
    const wrongType = files.find(
      (file) => !ACCEPTED.includes(file.type as (typeof ACCEPTED)[number]),
    );

    if (wrongType !== undefined) {
      setError('Só entram imagens JPEG, PNG ou WebP.');
      return;
    }

    const tooBig = files.find((file) => file.size > publicEnv.uploadMaxBytes);

    if (tooBig !== undefined) {
      setError(`Cada arquivo precisa ter no máximo ${megabytes(publicEnv.uploadMaxBytes)}.`);
      return;
    }

    setError(null);
    onFiles(files);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    if (!disabled) accept(event.dataTransfer.files);
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'flex flex-col items-center gap-2 rounded-card border-2 border-dashed p-6 text-center',
          dragging ? 'border-brand bg-brand-soft' : 'border-border',
          disabled && 'pointer-events-none opacity-60',
        )}
      >
        <ImagePlus aria-hidden className="size-6 text-text-muted" />

        <label
          htmlFor={inputId}
          className="cursor-pointer font-medium text-brand underline underline-offset-4"
        >
          Escolher {multiple ? 'imagens' : 'uma imagem'}
        </label>

        <p className="text-sm text-text-muted">
          ou arraste até aqui · JPEG, PNG ou WebP · até {megabytes(publicEnv.uploadMaxBytes)}
        </p>

        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(',')}
          multiple={multiple}
          disabled={disabled}
          onChange={(event) => {
            accept(event.target.files);
            event.target.value = '';
          }}
          className="sr-only"
        />
      </div>

      {error !== null && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
