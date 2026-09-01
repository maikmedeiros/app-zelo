'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clientApi } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type { Collection } from '@/shared/api/types';
import { cn } from '@/shared/utils/cn';
import { deleteReaction, setReaction } from '../api/set-reaction.client';
import type { ReactionSummaryOutput, ReactionTypeOutput } from '../types';

const useReactionTypes = (initialData?: Collection<ReactionTypeOutput>) =>
  useQuery({
    queryKey: queryKeys.reactionTypes.list(),
    queryFn: () => clientApi.get<Collection<ReactionTypeOutput>>('/reaction-types'),
    staleTime: Infinity,
    initialData,
  });

export interface ReactionBarProps {
  postId: string;
  initialTypes?: Collection<ReactionTypeOutput>;
  initialSummary?: ReactionSummaryOutput;
}

export function ReactionBar({ postId, initialTypes, initialSummary }: ReactionBarProps) {
  const queryClient = useQueryClient();
  const summaryKey = queryKeys.posts.reactions(postId);

  const types = useReactionTypes(initialTypes);
  const summary = useQuery({
    queryKey: summaryKey,
    queryFn: () => clientApi.get<ReactionSummaryOutput>(`/posts/${postId}/reactions`),
    initialData: initialSummary,
  });

  const mutation = useMutation<void, Error, string | null, { previous?: ReactionSummaryOutput }>({
    mutationFn: async (code) => {
      if (code === null) await deleteReaction(postId);
      else await setReaction(postId, code);
    },

    onMutate: async (code) => {
      await queryClient.cancelQueries({ queryKey: summaryKey });
      const previous = queryClient.getQueryData<ReactionSummaryOutput>(summaryKey);

      if (previous !== undefined) {
        queryClient.setQueryData<ReactionSummaryOutput>(summaryKey, optimistic(previous, code));
      }

      return { previous };
    },

    onError: (_error, _code, context) => {
      if (context?.previous !== undefined) queryClient.setQueryData(summaryKey, context.previous);
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey: summaryKey }),
  });

  const mine = summary.data?.mine ?? null;
  const counts = new Map(summary.data?.tallies.map((tally) => [tally.code, tally.count]) ?? []);

  return (
    <div className="flex flex-wrap items-center gap-1">
      {(types.data?.results ?? []).map((type) => {
        const count = counts.get(type.code) ?? 0;
        const chosen = mine === type.code;

        return (
          <button
            key={type.code}
            type="button"
            aria-pressed={chosen}
            aria-label={`${type.label}${count > 0 ? ` · ${count}` : ''}`}
            disabled={summary.isPending}
            onClick={() => mutation.mutate(chosen ? null : type.code)}
            className={cn(
              'flex min-h-11 items-center gap-1 rounded-control border px-2 text-sm',
              chosen
                ? 'border-brand bg-brand-soft text-brand'
                : 'border-transparent text-text-muted',
              'hover:border-border disabled:opacity-60',
            )}
          >
            <span aria-hidden>{type.emoji}</span>
            {count > 0 && <span>{count}</span>}
          </button>
        );
      })}
    </div>
  );
}

const optimistic = (summary: ReactionSummaryOutput, code: string | null): ReactionSummaryOutput => {
  const tallies = summary.tallies.map((tally) => {
    const wasMine = summary.mine === tally.code;
    const isMine = code === tally.code;

    if (wasMine === isMine) return tally;

    return { ...tally, count: tally.count + (isMine ? 1 : -1) };
  });

  const delta = (code === null ? 0 : 1) - (summary.mine === null ? 0 : 1);

  return { ...summary, mine: code, total: summary.total + delta, tallies };
};
