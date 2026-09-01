'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { clientApi } from '@/shared/api/client';
import { isApiError } from '@/shared/api/errors';
import { queryKeys } from '@/shared/api/query-keys';
import type { Paginated } from '@/shared/api/types';
import { Feature } from '@/config/features';
import { useCan, useSession } from '@/shared/auth/session-context';
import { Avatar } from '@/shared/components/avatar';
import { Button } from '@/shared/components/button';
import { EmptyState } from '@/shared/components/empty-state';
import { Field } from '@/shared/components/field';
import { IconButton } from '@/shared/components/icon-button';
import { Textarea } from '@/shared/components/textarea';
import { useToast } from '@/shared/components/toast';
import { ptBR } from '@/shared/i18n/pt-BR';
import { createComment } from '../api/create-comment.client';
import { deleteComment } from '../api/delete-comment.client';
import { createCommentSchema, type CreateCommentInput } from '../schemas/comments';
import type { CommentOutput } from '../types';
import { RemoveCommentDialog } from './remove-comment-dialog';

const PAGE_SIZE = 20;

const removalLabel = (comment: CommentOutput): string =>
  comment.status === 'REMOVIDO_PELO_AUTOR'
    ? ptBR.enums.commentStatus.REMOVIDO_PELO_AUTOR
    : ptBR.enums.commentStatus.REMOVIDO_PELA_ESCOLA;

export function CommentSection({
  postId,
  initialData,
}: {
  postId: string;
  initialData: Paginated<CommentOutput>;
}) {
  const session = useSession();
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();
  const canComment = useCan(Feature.CommentCreate);
  const canDelete = useCan(Feature.CommentDelete);
  const [page, setPage] = useState(1);
  const [removing, setRemoving] = useState<CommentOutput | null>(null);

  const params = { page, limit: PAGE_SIZE };
  const listKey = queryKeys.posts.comments(postId, params);

  const comments = useQuery({
    queryKey: listKey,
    queryFn: () => clientApi.get<Paginated<CommentOutput>>(`/posts/${postId}/comments`, { params }),
    initialData: page === 1 ? initialData : undefined,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCommentInput>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: { body: '' },
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(postId) });
    void queryClient.invalidateQueries({ queryKey: listKey });
    router.refresh();
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createComment(postId, values);
      reset();
      invalidate();
    } catch (error) {
      toast.show({
        title: 'Não foi possível comentar',
        description: isApiError(error) ? error.message : undefined,
        tone: 'danger',
      });
    }
  });

  const removal = useMutation({
    mutationFn: ({ comment, reason }: { comment: CommentOutput; reason?: string }) =>
      deleteComment(postId, comment.id, reason === undefined ? {} : { reason }),
    onSuccess: () => {
      setRemoving(null);
      toast.show({ title: 'Comentário removido', tone: 'success' });
      invalidate();
    },
    onError: (error) =>
      toast.show({
        title: 'Não foi possível remover',
        description: isApiError(error) ? error.message : undefined,
        tone: 'danger',
      }),
  });

  const data = comments.data ?? initialData;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Comentários</h2>

      {canComment && (
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-2">
          <Field id="comentario" label="Escreva um comentário" error={errors.body?.message}>
            <Textarea
              id="comentario"
              rows={3}
              aria-invalid={errors.body !== undefined}
              {...register('body')}
            />
          </Field>

          <Button type="submit" size="sm" disabled={isSubmitting} className="self-start">
            {isSubmitting ? 'Enviando…' : 'Comentar'}
          </Button>
        </form>
      )}

      {data.results.length === 0 ? (
        <EmptyState
          title="Ainda não há comentários"
          description="Seja a primeira pessoa a responder."
        />
      ) : (
        <ul className="flex flex-col gap-4">
          {data.results.map((comment) => {
            const removed = comment.status !== 'PUBLICADO';
            const isAuthor = comment.authorId === session.id;

            return (
              <li key={comment.id} className="flex gap-3">
                <Avatar name={comment.authorName} personId={comment.authorId} size="sm" />

                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{comment.authorName}</span>

                    {!removed && (isAuthor || canDelete) && (
                      <IconButton
                        label={ptBR.common.remove}
                        onClick={() => setRemoving(comment)}
                        className="size-9"
                      >
                        <Trash2 aria-hidden className="size-4" />
                      </IconButton>
                    )}
                  </div>

                  {removed ? (
                    <p className="text-sm italic text-text-muted">
                      {removalLabel(comment)}
                      {comment.removalReason !== null && ` · ${comment.removalReason}`}
                    </p>
                  ) : (
                    <p className="whitespace-pre-line">{comment.body}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {data.totalPages > 1 && (
        <nav aria-label="Paginação dos comentários" className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((current) => current - 1)}
          >
            {ptBR.common.previousPage}
          </Button>
          <span className="text-sm text-text-muted">
            {ptBR.common.pageOf(data.page, data.totalPages)}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page >= data.totalPages}
            onClick={() => setPage((current) => current + 1)}
          >
            {ptBR.common.nextPage}
          </Button>
        </nav>
      )}

      <RemoveCommentDialog
        comment={removing}
        isAuthor={removing?.authorId === session.id}
        pending={removal.isPending}
        onCancel={() => setRemoving(null)}
        onConfirm={(reason) => {
          if (removing !== null) removal.mutate({ comment: removing, reason });
        }}
      />
    </section>
  );
}
