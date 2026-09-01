import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Feature } from '@/config/features';
import { isApiError } from '@/shared/api/errors';
import { RequireCapability } from '@/shared/auth/require-capability';
import { Breadcrumbs } from '@/shared/components/breadcrumbs';
import { PageHeader } from '@/shared/components/page-header';
import { findPostById } from '@/modules/posts/api/find-post-by-id';
import { PostComposer } from '@/modules/posts/components/post-composer';
import { isDraft, type PostOutput } from '@/modules/posts/types';

export const metadata: Metadata = { title: 'Nova postagem' };

const loadDraft = async (postId: string | undefined): Promise<PostOutput | undefined> => {
  if (postId === undefined) return undefined;

  try {
    const post = await findPostById(postId);
    return isDraft(post) ? post : notFound();
  } catch (error) {
    if (isApiError(error) && error.statusCode === 404) notFound();
    throw error;
  }
};

export default async function NewPostPage({ searchParams }: PageProps<'/feed/nova'>) {
  const { rascunho } = await searchParams;
  const draft = await loadDraft(typeof rascunho === 'string' ? rascunho : undefined);

  return (
    <RequireCapability feature={Feature.PostCreate}>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <PageHeader
          title={draft === undefined ? 'Nova postagem' : 'Editar rascunho'}
          description="A postagem nasce como rascunho. Publicar é o último passo."
          breadcrumbs={
            <Breadcrumbs
              items={[
                { label: 'Feed', href: '/feed' },
                { label: draft === undefined ? 'Nova postagem' : 'Rascunho' },
              ]}
            />
          }
        />

        <PostComposer post={draft} />
      </div>
    </RequireCapability>
  );
}
