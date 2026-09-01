export const POST_TYPES = ['REGISTRO_DIARIO', 'RECADO', 'EVENTO'] as const;
export const POST_AUDIENCES = ['TURMA', 'ALUNO'] as const;
export const POST_QUERYABLE_STATUSES = ['PUBLICADA', 'RASCUNHO'] as const;
export const COMMENT_STATUSES = [
  'PUBLICADO',
  'REMOVIDO_PELO_AUTOR',
  'REMOVIDO_PELA_ESCOLA',
] as const;

export type PostType = (typeof POST_TYPES)[number];
export type PostAudience = (typeof POST_AUDIENCES)[number];
export type PostQueryableStatus = (typeof POST_QUERYABLE_STATUSES)[number];
export type CommentStatus = (typeof COMMENT_STATUSES)[number];

export interface PostClass {
  id: string;
  name: string;
}

export interface PostStudent {
  id: string;
  name: string;
  classId: string | null;
  className: string | null;
}

export interface PostMedia {
  id: string;
  mimeType: string;
  sizeBytes: number;
  order: number;
}

export interface PostOutput {
  id: string;
  audience: PostAudience;
  classes: PostClass[];
  students: PostStudent[];
  authorId: string;
  authorName: string;
  type: PostType;
  title: string | null;
  body: string | null;
  referenceDate: string;
  publishedAt: string | null;
  media: PostMedia[];
  commentCount: number;
  reactionCount: number;
  myReaction: string | null;
}

export interface MediaOutput {
  id: string;
  postId: string;
  mimeType: string;
  sizeBytes: number;
  order: number;
  createdAt: string;
}

export interface CommentOutput {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  body: string | null;
  status: CommentStatus;
  removalReason: string | null;
  createdAt: string;
  editedAt: string | null;
}

export interface ReactionTypeOutput {
  code: string;
  label: string;
  emoji: string;
  order: number;
}

export interface ReactionTally extends ReactionTypeOutput {
  count: number;
}

export interface ReactionSummaryOutput {
  postId: string;
  total: number;
  tallies: ReactionTally[];
  mine: string | null;
}

export const isDraft = (post: PostOutput): boolean => post.publishedAt === null;

export const mediaUrl = (postId: string, mediaId: string): string =>
  `/api/v1/posts/${postId}/media/${mediaId}`;
