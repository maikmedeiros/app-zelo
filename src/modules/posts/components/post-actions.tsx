'use client';

import { useRouter } from 'next/navigation';
import { MoreVertical, Pencil, Send, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { isApiError } from '@/shared/api/errors';
import { Feature } from '@/config/features';
import { useCan, useSession } from '@/shared/auth/session-context';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/shared/components/alert-dialog';
import { Button } from '@/shared/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/dropdown-menu';
import { useToast } from '@/shared/components/toast';
import { ptBR } from '@/shared/i18n/pt-BR';
import { deletePost } from '../api/delete-post.client';
import { publishPost } from '../api/publish-post.client';
import type { PostOutput } from '../types';
import { isDraft } from '../types';

export function PostActions({ post }: { post: PostOutput }) {
  const router = useRouter();
  const toast = useToast();
  const session = useSession();
  const canUpdate = useCan(Feature.PostUpdate);
  const canDelete = useCan(Feature.PostDelete);
  const canPublish = useCan(Feature.PostPublish);
  const [pending, setPending] = useState(false);

  const isAuthor = post.authorId === session.id;
  const draft = isDraft(post);

  const publish = async () => {
    setPending(true);

    try {
      await publishPost(post.id);
      toast.show({ title: 'Postagem publicada', tone: 'success' });
      router.refresh();
    } catch (error) {
      toast.show({
        title: 'Não foi possível publicar',
        description: isApiError(error) ? error.message : undefined,
        tone: 'danger',
      });
    } finally {
      setPending(false);
    }
  };

  const remove = async () => {
    setPending(true);

    try {
      await deletePost(post.id);
      toast.show({ title: 'Postagem removida', tone: 'success' });
      router.push('/feed');
      router.refresh();
    } catch (error) {
      toast.show({
        title: 'Não foi possível remover',
        description: isApiError(error) ? error.message : undefined,
        tone: 'danger',
      });
    } finally {
      setPending(false);
    }
  };

  if (!canUpdate && !canDelete && !canPublish) return null;

  return (
    <div className="flex items-center gap-2">
      {draft && canPublish && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" disabled={pending}>
              <Send aria-hidden className="size-4" />
              Publicar
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent
            title="Publicar a postagem?"
            description="As famílias passam a ver este registro."
            confirmLabel="Publicar"
            confirmVariant="primary"
            pending={pending}
            onConfirm={() => void publish()}
          />
        </AlertDialog>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Ações da postagem"
          className="inline-flex size-11 items-center justify-center rounded-control hover:bg-surface-muted"
        >
          <MoreVertical aria-hidden className="size-5" />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          {draft && canUpdate && (isAuthor || canDelete) && (
            <DropdownMenuItem onSelect={() => router.push(`/feed/nova?rascunho=${post.id}`)}>
              <Pencil aria-hidden className="size-4" />
              Editar rascunho
            </DropdownMenuItem>
          )}

          {canDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                  <Trash2 aria-hidden className="size-4" />
                  {ptBR.common.remove}
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent
                title="Remover a postagem?"
                description="A postagem some do feed das famílias. A remoção é lógica: o registro fica no banco, mas ninguém mais o vê."
                confirmLabel={ptBR.common.remove}
                pending={pending}
                onConfirm={() => void remove()}
              />
            </AlertDialog>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
