'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import type { Collection } from '@/shared/api/types';
import { isApiError } from '@/shared/api/errors';
import { useToast } from '@/shared/components/toast';
import { cn } from '@/shared/utils/cn';
import { deleteReaction, setReaction } from '../api/set-reaction.client';
import type { ReactionTypeOutput } from '../types';

export interface PostReactionsProps {
  postId: string;
  myReaction: string | null;
  reactionCount: number;
  types: Collection<ReactionTypeOutput>;
}

export function PostReactions({ postId, myReaction, reactionCount, types }: PostReactionsProps) {
  const router = useRouter();
  const toast = useToast();
  const [, startTransition] = useTransition();
  const [mine, setMine] = useState(myReaction);
  const [total, setTotal] = useState(reactionCount);

  const react = async (code: string) => {
    const next = mine === code ? null : code;
    const previous = { mine, total };

    setMine(next);
    setTotal(total + (next === null ? -1 : previous.mine === null ? 1 : 0));

    try {
      if (next === null) await deleteReaction(postId);
      else await setReaction(postId, next);

      startTransition(() => router.refresh());
    } catch (error) {
      setMine(previous.mine);
      setTotal(previous.total);

      toast.show({
        title: 'Não foi possível registrar a reação',
        description: isApiError(error) ? error.message : undefined,
        tone: 'danger',
      });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1">
      {types.results.map((type) => (
        <button
          key={type.code}
          type="button"
          aria-pressed={mine === type.code}
          aria-label={type.label}
          onClick={() => void react(type.code)}
          className={cn(
            'flex min-h-11 items-center rounded-control border px-2 text-sm',
            mine === type.code
              ? 'border-brand bg-brand-soft'
              : 'border-transparent hover:border-border',
          )}
        >
          <span aria-hidden>{type.emoji}</span>
        </button>
      ))}

      {total > 0 && (
        <span className="text-sm text-text-muted">
          {total} {total === 1 ? 'reação' : 'reações'}
        </span>
      )}
    </div>
  );
}
