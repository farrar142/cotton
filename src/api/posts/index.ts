import { Block } from '#/utils/textEditor/blockTypes';
import { GenericAPI, Paginated } from '../general';
import { User } from '../users/types';

export type PostUpsert = {
  text: string;
  blocks: Block[][];
  mentions: { mentioned_to: number }[];
};
export type Post = PostUpsert & {
  id: number;
  created_at: string;
  user: User;

  has_bookmark: boolean;
  has_repost: boolean;
  has_favorite: boolean;
  favorites_count: number;
  mentions: { mentioned_to: User }[];
  relavant_repost?: User;
  latest_date: string;
};
class PostAPIGenerator extends GenericAPI<Post, PostUpsert> {
  get getFollowingTimeline() {
    return this.getItemsRequest<Post, {}, Paginated<Post>>(
      this.getEndpoint('/timeline/followings/')
    );
  }
}
export const Posts = {
  post: new PostAPIGenerator('/posts'),
};
