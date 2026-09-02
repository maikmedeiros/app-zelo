import type { Metadata } from 'next';
import { cache } from 'react';
import { Feature } from '@/config/features';
import { orNotFound } from '@/shared/api/not-found';
import { requireCapability } from '@/shared/auth/require-capability';
import { Avatar } from '@/shared/components/avatar';
import { Breadcrumbs } from '@/shared/components/breadcrumbs';
import { Gallery } from '@/shared/components/gallery';
import { PageHeader } from '@/shared/components/page-header';
import { findListComments } from '@/modules/posts/api/find-list-comments';
import { findPostById } from '@/modules/posts/api/find-post-by-id';
import { findReactionSummary } from '@/modules/posts/api/find-reaction-summary';
import { findListReactionTypes } from '@/modules/reaction-types/api/find-list-reaction-types';
import { CommentSection } from '@/modules/posts/components/comment-section';
import { PostActions } from '@/modules/posts/components/post-actions';
import { PostMetaRow } from '@/modules/posts/components/post-meta';
import { ReactionBar } from '@/modules/posts/components/reaction-bar';
import { mediaUrl, type PostOutput } from '@/modules/posts/types';
import { ptBR } from '@/shared/i18n/pt-BR';

const loadPost = cache((postId: string): Promise<PostOutput> => orNotFound(findPostById(postId)));

export async function generateMetadata({ params }: PageProps<'/feed/[postId]'>): Promise<Metadata> {
  const { postId } = await params;
  const post = await loadPost(postId);

  return { title: post.title ?? ptBR.enums.postType[post.type] };
}

export default async function PostPage({ params }: PageProps<'/feed/[postId]'>) {
  const { postId } = await params;

  await requireCapability(Feature.PostView);

  const [post, comments, summary, reactionTypes] = await Promise.all([
    loadPost(postId),
    findListComments(postId),
    findReactionSummary(postId),
    findListReactionTypes(),
  ]);

  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <PageHeader
        title={post.title ?? ptBR.enums.postType[post.type]}
        breadcrumbs={
          <Breadcrumbs items={[{ label: 'Feed', href: '/feed' }, { label: 'Postagem' }]} />
        }
        actions={<PostActions post={post} />}
      />

      <div className="flex items-center gap-3">
        <Avatar name={post.authorName} personId={post.authorId} size="sm" />
        <span className="font-medium">{post.authorName}</span>
      </div>

      <PostMetaRow post={post} />

      {post.body !== null && <p className="whitespace-pre-line text-lg">{post.body}</p>}

      <Gallery
        items={post.media.map((item) => ({
          id: item.id,
          src: mediaUrl(post.id, item.id),
          alt: `Imagem da postagem ${post.title ?? ''}`.trim(),
        }))}
      />

      <ReactionBar postId={post.id} initialTypes={reactionTypes} initialSummary={summary} />

      <CommentSection postId={post.id} initialData={comments} />
    </article>
  );
}
