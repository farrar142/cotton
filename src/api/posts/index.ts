import { Block } from '#/utils/textEditor/blockTypes';
import { ImageType } from '../commons/types';
import { GenericAPI, Paginated } from '../general';
import { User } from '../users/types';

export type PostUpsert = {
  text: string;
  blocks: Block[][];
  mentions: { mentioned_to: number }[];
  images: ImageType[];
};
export type Post = PostUpsert & {
  id: number;
  created_at: string;
  user: User;

  has_view: boolean;
  has_bookmark: boolean;
  has_repost: boolean;
  has_favorite: boolean;
  views_count: number;
  favorites_count: number;
  mentions: { mentioned_to: User }[];
  relavant_repost?: User;
  latest_date: string;
};

type PostChildUrl = 'reposts' | 'views' | 'favorites' | 'bookmarks';

class PostAPIGenerator extends GenericAPI<Post, PostUpsert> {
  get getUserTimeline() {
    return (username: string) =>
      this.getItemsRequest<Post, {}, Paginated<Post>>(
        this.getEndpoint(`/timeline/${username}/`)
      );
  }
  get getFollowingTimeline() {
    return this.getItemsRequest<Post, {}, Paginated<Post>>(
      this.getEndpoint('/timeline/followings/')
    );
  }
  get getGlobalTimeline() {
    return this.getItemsRequest<Post, {}, Paginated<Post>>(
      this.getEndpoint('/timeline/global/')
    );
  }
  getChildRelatedItem = (childUrl: PostChildUrl) => {
    const endpoint = this.getEndpoint(`/${childUrl}/`);
    return this.getItemsRequest(endpoint);
  };
  getChildItem = (post: Post, childUrl: PostChildUrl) => {
    const endpoint = this.getEndpoint(`/${post.id}/${childUrl}/`);
    return this.client.get<{ is_success: boolean }>(endpoint);
  };
  postChildItem = (post: Post, childUrl: PostChildUrl) => {
    const endpoint = this.getEndpoint(`/${post.id}/${childUrl}/`);
    return this.client.post<{ is_success: boolean }>(endpoint);
  };
  deleteChildItem = (post: Post, childUrl: PostChildUrl) => {
    const endpoint = this.getEndpoint(`/${post.id}/${childUrl}/`);
    return this.client.delete<{ is_success: boolean }>(endpoint);
  };
}

export const Posts = {
  post: new PostAPIGenerator('/posts'),
};
