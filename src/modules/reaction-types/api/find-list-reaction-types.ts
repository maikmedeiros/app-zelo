import 'server-only';
import { serverApi } from '@/shared/api/server';
import type { Collection } from '@/shared/api/types';
import type { ReactionTypeOutput } from '@/modules/posts/types';

export const findListReactionTypes = () =>
  serverApi.get<Collection<ReactionTypeOutput>>('/reaction-types');
