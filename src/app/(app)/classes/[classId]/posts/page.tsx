import type { Metadata } from 'next';
import { Feature } from '@/config/features';
import { getClassById } from '@/modules/classes/api/get-class-by-id';
import { requireCapability } from '@/shared/auth/require-capability';
import { EmptyState } from '@/shared/components/empty-state';
import { Pagination } from '@/shared/components/pagination';
import { findListPosts } from '@/modules/posts/api/find-list-posts';
import { findListReactionTypes } from '@/modules/reaction-types/api/find-list-reaction-types';
import { PostCard } from '@/modules/posts/components/post-card';
import { parseFeedSearchParams } from '@/modules/posts/schemas/find-list-posts';

export const generateMetadata = async ({
  params,
}: PageProps<'/classes/[classId]/posts'>): Promise<Metadata> => {
  const { classId } = await params;
  const turma = await getClassById(classId);

  return { title: `Postagens · ${turma.name}` };
};

export default async function ClassPostsPage({
  params,
  searchParams,
}: PageProps<'/classes/[classId]/posts'>) {
  const { classId } = await params;
  const filters = parseFeedSearchParams(await searchParams);

  await requireCapability(Feature.PostView);

  const [posts, reactionTypes] = await Promise.all([
    findListPosts({ ...filters, classId }),
    findListReactionTypes(),
  ]);

  return (
    <div className="flex flex-col gap-4">
      {posts.results.length === 0 ? (
        <EmptyState
          title="Nenhuma postagem desta turma"
          description="O que a escola publicar para a turma aparece aqui e no feed das famílias."
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
  );
}
