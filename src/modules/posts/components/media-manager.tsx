'use client';

import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { isApiError } from '@/shared/api/errors';
import { FileDropzone } from '@/shared/components/file-dropzone';
import { IconButton } from '@/shared/components/icon-button';
import { Skeleton } from '@/shared/components/skeleton';
import { useToast } from '@/shared/components/toast';
import { ptBR } from '@/shared/i18n/pt-BR';
import { createMedia } from '../api/create-media.client';
import { deleteMedia } from '../api/delete-media.client';
import type { MediaOutput } from '../types';
import { mediaUrl } from '../types';

export function MediaManager({
  postId,
  media,
  onChange,
}: {
  postId: string;
  media: MediaOutput[];
  onChange: (media: MediaOutput[]) => void;
}) {
  const toast = useToast();
  const [uploading, setUploading] = useState(0);

  const upload = async (files: File[]) => {
    setUploading(files.length);

    const uploaded: MediaOutput[] = [];

    for (const file of files) {
      try {
        uploaded.push(await createMedia(postId, file));
      } catch (error) {
        toast.show({
          title: `Não foi possível enviar ${file.name}`,
          description: isApiError(error) ? error.message : undefined,
          tone: 'danger',
        });
      } finally {
        setUploading((count) => count - 1);
      }
    }

    if (uploaded.length > 0) onChange([...media, ...uploaded]);
  };

  const remove = async (item: MediaOutput) => {
    try {
      await deleteMedia(postId, item.id);
      onChange(media.filter((current) => current.id !== item.id));
    } catch (error) {
      toast.show({
        title: 'Não foi possível remover a imagem',
        description: isApiError(error) ? error.message : undefined,
        tone: 'danger',
      });
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <FileDropzone multiple disabled={uploading > 0} onFiles={(files) => void upload(files)} />

      {(media.length > 0 || uploading > 0) && (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {media.map((item) => (
            <li key={item.id} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mediaUrl(postId, item.id)}
                alt=""
                loading="lazy"
                width={240}
                height={240}
                className="aspect-square w-full rounded-control object-cover"
              />

              <IconButton
                label={ptBR.common.remove}
                onClick={() => void remove(item)}
                className="absolute right-1 top-1 size-9 bg-surface/90"
              >
                <Trash2 aria-hidden className="size-4" />
              </IconButton>
            </li>
          ))}

          {Array.from({ length: uploading }, (_, index) => (
            <li key={`enviando-${index}`}>
              <Skeleton className="aspect-square w-full" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
