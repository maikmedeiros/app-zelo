import Link from 'next/link';
import { Avatar } from '@/shared/components/avatar';
import { Card, CardContent } from '@/shared/components/card';
import type { Collection } from '@/shared/api/types';
import type { PostOutput, ReactionTypeOutput } from '../types';
import { mediaUrl } from '../types';
import { CommentCount, PostMetaRow } from './post-meta';
import { PostReactions } from './post-reactions';

const EXCERPT_LENGTH = 240;

const excerpt = (body: string | null): string | null => {
  if (body === null) return null;

  return body.length > EXCERPT_LENGTH ? `${body.slice(0, EXCERPT_LENGTH).trimEnd()}…` : body;
};

export function PostCard({
  post,
  reactionTypes,
}: {
  post: PostOutput;
  reactionTypes: Collection<ReactionTypeOutput>;
}) {
  const preview = excerpt(post.body);
  const thumbnails = post.media.slice(0, 3);

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Avatar name={post.authorName} personId={post.authorPersonId} size="sm" />
          <span className="font-medium">{post.authorName}</span>
        </div>

        <PostMetaRow post={post} />

        <Link href={`/feed/${post.id}`} className="flex flex-col gap-2">
          {post.title !== null && <h2 className="text-lg font-semibold">{post.title}</h2>}
          {preview !== null && <p className="whitespace-pre-line text-text">{preview}</p>}
        </Link>

        {thumbnails.length > 0 && (
          <ul className="grid grid-cols-3 gap-2">
            {thumbnails.map((media) => (
              <li key={media.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mediaUrl(post.id, media.id)}
                  alt=""
                  loading="lazy"
                  width={320}
                  height={320}
                  className="aspect-square w-full rounded-control object-cover"
                />
              </li>
            ))}
          </ul>
        )}

        {post.media.length > thumbnails.length && (
          <p className="text-sm text-text-muted">
            +{post.media.length - thumbnails.length} imagem(ns)
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2">
          <PostReactions
            postId={post.id}
            myReaction={post.myReaction}
            reactionCount={post.reactionCount}
            types={reactionTypes}
          />

          <Link href={`/feed/${post.id}`} className="flex items-center">
            <CommentCount count={post.commentCount} />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
