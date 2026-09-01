import { CalendarDays, MessageCircle } from 'lucide-react';
import { ptBR } from '@/shared/i18n/pt-BR';
import { Badge } from '@/shared/components/badge';
import { formatDate } from '@/shared/utils/date';
import type { PostOutput } from '../types';
import { isDraft } from '../types';

export function PostAudienceChips({ post }: { post: PostOutput }) {
  const labels =
    post.audience === 'TURMA'
      ? post.classes.map((item) => item.name)
      : post.students.map((item) =>
          item.className === null ? item.name : `${item.name} · ${item.className}`,
        );

  return (
    <>
      {labels.map((label) => (
        <Badge key={label} tone="brand">
          {label}
        </Badge>
      ))}
    </>
  );
}

export function PostMetaRow({ post }: { post: PostOutput }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>{ptBR.enums.postType[post.type]}</Badge>
      <PostAudienceChips post={post} />
      {isDraft(post) && <Badge tone="accent">{ptBR.enums.postStatus.RASCUNHO}</Badge>}

      <span className="flex items-center gap-1 text-sm text-text-muted">
        <CalendarDays aria-hidden className="size-4" />
        {formatDate(post.referenceDate)}
      </span>
    </div>
  );
}

export function CommentCount({ count }: { count: number }) {
  return (
    <span className="flex items-center gap-1 text-sm text-text-muted">
      <MessageCircle aria-hidden className="size-4" />
      {count}
    </span>
  );
}
