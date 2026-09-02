'use client';

import { Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { Feature } from '@/config/features';
import { useCan } from '@/shared/auth/session-context';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/shared/components/alert-dialog';
import { Button } from '@/shared/components/button';
import { FileDropzone } from '@/shared/components/file-dropzone';
import { useApiAction } from '@/shared/hooks/use-api-action';
import { deletePhoto } from '../api/delete-photo.client';
import { updatePhoto } from '../api/update-photo.client';
import { photoUrl } from '../types';
import { SquareCropper, type CropFn } from './square-cropper';

export interface PhotoManagerProps {
  personId: string;
  personName: string;
  hasPhoto: boolean;
}

export function PhotoManager({ personId, personName, hasPhoto }: PhotoManagerProps) {
  const { run, pending } = useApiAction();
  const canUpdate = useCan(Feature.PhotoUpdate);
  const [chosen, setChosen] = useState<File | null>(null);
  const [broken, setBroken] = useState(false);
  const cropRef = useRef<CropFn | null>(null);

  const send = async () => {
    const crop = cropRef.current;
    if (crop === null) return;

    const file = await crop();

    await run(() => updatePhoto(personId, file), {
      success: 'Foto atualizada',
      failure: 'Não foi possível enviar a foto',
      onSuccess: () => {
        setBroken(false);
        setChosen(null);
      },
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {chosen === null ? (
        <>
          {hasPhoto && !broken ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={photoUrl(personId)}
              alt={`Foto de ${personName}`}
              width={160}
              height={160}
              loading="lazy"
              onError={() => setBroken(true)}
              className="size-40 rounded-full border border-border object-cover"
            />
          ) : (
            <p className="text-text-muted">Sem foto no cadastro.</p>
          )}

          {canUpdate && (
            <>
              <FileDropzone onFiles={(files) => setChosen(files[0] ?? null)} className="w-full" />

              {hasPhoto && !broken && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="secondary" size="sm" disabled={pending}>
                      <Trash2 aria-hidden className="size-4" />
                      Remover foto
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent
                    title="Remover a foto?"
                    description="O cadastro volta a mostrar as iniciais. Uma foto nova pode ser enviada a qualquer momento."
                    confirmLabel="Remover"
                    pending={pending}
                    onConfirm={() =>
                      void run(() => deletePhoto(personId), {
                        success: 'Foto removida',
                        failure: 'Não foi possível remover a foto',
                      })
                    }
                  />
                </AlertDialog>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <SquareCropper key={`${chosen.name}-${chosen.size}`} file={chosen} cropRef={cropRef} />

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={pending}
              onClick={() => setChosen(null)}
            >
              Cancelar
            </Button>
            <Button size="sm" disabled={pending} onClick={() => void send()}>
              {pending ? 'Enviando…' : 'Salvar foto'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
