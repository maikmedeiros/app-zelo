import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Feature } from '@/config/features';
import { getCurrentSession } from '@/shared/auth/current-session';
import { hasCapability } from '@/shared/auth/capabilities';
import { RequireCapability } from '@/shared/auth/require-capability';
import { Button } from '@/shared/components/button';
import { EmptyState } from '@/shared/components/empty-state';
import { PageHeader } from '@/shared/components/page-header';
import { Pagination } from '@/shared/components/pagination';
import { findListPosts } from '@/modules/posts/api/find-list-posts';
import { findListStudents } from '@/modules/students/api/find-list-students';
import { findListReactionTypes } from '@/modules/reaction-types/api/find-list-reaction-types';
import { FeedFilters } from '@/modules/posts/components/feed-filters';
import { PostCard } from '@/modules/posts/components/post-card';
import { parseFeedSearchParams } from '@/modules/posts/schemas/find-list-posts';

export const metadata: Metadata = { title: 'Feed' };

export default async function FeedPage({ searchParams }: PageProps<'/feed'>) {
  const params = parseFeedSearchParams(await searchParams);
  const session = await getCurrentSession();
  const canCreate = hasCapability(session, Feature.PostCreate);

  const [posts, students, reactionTypes] = await Promise.all([
    findListPosts(params),
    findListStudents({ limit: 20, active: true }),
    findListReactionTypes(),
  ]);

  return (
    <RequireCapability feature={Feature.PostView}>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <PageHeader
          title="Feed"
          description="O que aconteceu na escola, em ordem cronológica."
          actions={
            canCreate ? (
              <Button asChild size="sm">
                <Link href="/feed/nova">
                  <Plus aria-hidden className="size-4" />
                  Nova postagem
                </Link>
              </Button>
            ) : undefined
          }
        />

        <FeedFilters students={students} />

        {posts.results.length === 0 ? (
          <EmptyState
            title={
              params.status === 'RASCUNHO' ? 'Nenhum rascunho por aqui' : 'Ainda não há postagens'
            }
            description={
              params.status === 'RASCUNHO'
                ? 'Rascunhos ficam visíveis só para quem pode publicar.'
                : 'Quando a escola publicar algo, aparece aqui.'
            }
          />
        ) : (
          <ul className="flex flex-col gap-4">
            {posts.results.map((post) => (
              <li key={post.id}>
                <PostCard post={post} reactionTypes={reactionTypes} />
              </li>
            ))}
          </ul>
        )}

        <Pagination
          page={posts.page}
          totalPages={posts.totalPages}
          totalResults={posts.totalResults}
        />
      </div>
    </RequireCapability>
  );
}
