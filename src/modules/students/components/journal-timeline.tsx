'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Feature } from '@/config/features';
import { isApiError } from '@/shared/api/errors';
import type { Paginated } from '@/shared/api/types';
import { useCan, useSession, useWidestScope } from '@/shared/auth/session-context';
import type { Scope } from '@/shared/auth/session';
import { EmptyState } from '@/shared/components/empty-state';
import { useToast } from '@/shared/components/toast';
import { deleteJournalEntry } from '../api/delete-journal-entry.client';
import { updateJournalEntry } from '../api/update-journal-entry.client';
import type { JournalEntryOutput } from '../types';
import { JournalComposer } from './journal-composer';
import { JournalEntryCard } from './journal-entry-card';
import { EditEntryDialog, RemoveEntryDialog } from './journal-entry-dialogs';

interface Thread {
  entry: JournalEntryOutput;
  replies: JournalEntryOutput[];
}

const toThreads = (entries: JournalEntryOutput[]): Thread[] => {
  const roots = entries.filter((entry) => entry.repliesToId === null);
  const orphans = entries.filter(
    (entry) => entry.repliesToId !== null && !roots.some((root) => root.id === entry.repliesToId),
  );

  const threads = roots.map((entry) => ({
    entry,
    replies: entries.filter((candidate) => candidate.repliesToId === entry.id),
  }));

  return [...threads, ...orphans.map((entry) => ({ entry, replies: [] }))];
};

export function JournalTimeline({
  studentId,
  referenceDate,
  entries,
}: {
  studentId: string;
  referenceDate: string;
  entries: Paginated<JournalEntryOutput>;
}) {
  const router = useRouter();
  const toast = useToast();
  const session = useSession();
  const canCreate = useCan(Feature.JournalCreate);
  const updateScope = useWidestScope(Feature.JournalUpdate);
  const deleteScope = useWidestScope(Feature.JournalDelete);

  const [replyingTo, setReplyingTo] = useState<JournalEntryOutput | null>(null);
  const [editing, setEditing] = useState<JournalEntryOutput | null>(null);
  const [removing, setRemoving] = useState<JournalEntryOutput | null>(null);
  const [pending, setPending] = useState(false);

  const threads = toThreads(entries.results);

  const run = async (action: () => Promise<unknown>, success: string, failure: string) => {
    setPending(true);

    try {
      await action();
      setEditing(null);
      setRemoving(null);
      toast.show({ title: success, tone: 'success' });
      router.refresh();
    } catch (error) {
      toast.show({
        title: failure,
        description: isApiError(error) ? error.message : undefined,
        tone: 'danger',
      });
    } finally {
      setPending(false);
    }
  };

  const allows = (scope: Scope | null, isAuthor: boolean): boolean =>
    scope === null ? false : scope === 'PROPRIA' ? isAuthor : true;

  const permissions = (entry: JournalEntryOutput) => {
    const isAuthor = entry.authorId === session.id;

    return {
      canEdit: allows(updateScope, isAuthor),
      canRemove: allows(deleteScope, isAuthor),
    };
  };

  return (
    <div className="flex flex-col gap-6">
      {canCreate && (
        <JournalComposer
          studentId={studentId}
          referenceDate={referenceDate}
          replyingTo={replyingTo}
          onCancelReply={() => setReplyingTo(null)}
          onSaved={() => router.refresh()}
        />
      )}

      {threads.length === 0 ? (
        <EmptyState
          title="Nada registrado neste dia"
          description={
            canCreate
              ? 'Escreva acima como foi o dia da criança.'
              : 'Quando a escola registrar algo, aparece aqui.'
          }
        />
      ) : (
        <ol className="flex flex-col gap-3">
          {threads.map((thread) => (
            <li key={thread.entry.id} className="flex flex-col gap-3">
              <JournalEntryCard
                entry={thread.entry}
                {...permissions(thread.entry)}
                canReply={canCreate}
                onEdit={setEditing}
                onRemove={setRemoving}
                onReply={setReplyingTo}
              />

              {thread.replies.map((reply) => (
                <JournalEntryCard
                  key={reply.id}
                  entry={reply}
                  isReply
                  {...permissions(reply)}
                  onEdit={setEditing}
                  onRemove={setRemoving}
                />
              ))}
            </li>
          ))}
        </ol>
      )}

      <EditEntryDialog
        entry={editing}
        pending={pending}
        onCancel={() => setEditing(null)}
        onConfirm={(text) => {
          if (editing !== null) {
            void run(
              () => updateJournalEntry(studentId, editing.id, { text }),
              'Registro atualizado',
              'Não foi possível editar',
            );
          }
        }}
      />

      <RemoveEntryDialog
        entry={removing}
        isAuthor={removing?.authorId === session.id}
        pending={pending}
        onCancel={() => setRemoving(null)}
        onConfirm={(reason) => {
          if (removing !== null) {
            void run(
              () =>
                deleteJournalEntry(studentId, removing.id, reason === undefined ? {} : { reason }),
              'Registro removido',
              'Não foi possível remover',
            );
          }
        }}
      />
    </div>
  );
}
