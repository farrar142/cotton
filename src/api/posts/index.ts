import { Block } from '#/utils/textEditor/blockTypes';
import { ImageType } from '../commons/types';
import { GenericAPI, Paginated, TimeLinePaginated } from '../general';
import { User } from '../users/types';

export type PostUpsert = {
  text: string;
  blocks: Block[][];
  mentions: { mentioned_to: number }[];
  images: ImageType[];
  parent?: number;
  origin?: number;
  quote?: number;
};
export type Post = PostUpsert & {
  id: number;
  created_at: string;
  user: User;
  depth: number;

  has_view: boolean;
  has_bookmark: boolean;
  has_repost: boolean;
  has_favorite: boolean;
  has_quote: boolean;
  views_count: number;
  favorites_count: number;
  replies_count: number;
  reposts_count: number;
  quotes_count: number;
  relavant_repost?: User;
  latest_date: string;
  reply_row_number_desc: number;
  deleted_at?: string;
};

type PostChildUrl = 'reposts' | 'views' | 'favorites' | 'bookmarks';

class PostAPIGenerator extends GenericAPI<Post, PostUpsert> {
  get getUserTimeline() {
    return (username: string) =>
      this.getItemsRequest<Post, {}, TimeLinePaginated<Post>>(
        this.getEndpoint(`/timeline/username/${username}/`)
      );
  }
  get getUserMediaItems() {
    return (username: string) =>
      this.getItemsRequest<Post, {}, TimeLinePaginated<Post>>(
        this.getEndpoint(`/timeline/username/${username}/media/`)
      );
  }
  get getUserRepliesItems() {
    return (username: string) =>
      this.getItemsRequest<Post, {}, TimeLinePaginated<Post>>(
        this.getEndpoint(`/timeline/username/${username}/replies/`)
      );
  }
  get getFavoriteItems() {
    return (username: string) =>
      this.getItemsRequest<Post, {}, TimeLinePaginated<Post>>(
        this.getEndpoint(`/timeline/username/${username}/favorites/`)
      );
  }
  get getFollowingTimeline() {
    return this.getItemsRequest<Post, {}, TimeLinePaginated<Post>>(
      this.getEndpoint('/timeline/followings/')
    );
  }
  get getRecommendTimeline() {
    return this.getItemsRequest<Post, {}, TimeLinePaginated<Post>>(
      this.getEndpoint('/timeline/recommended/')
    );
  }
  get getGlobalTimeline() {
    return this.getItemsRequest<Post, {}, TimeLinePaginated<Post>>(
      this.getEndpoint('/timeline/global/')
    );
  }
  get getSearchTimeline() {
    return this.getItemsRequest<Post, {}, TimeLinePaginated<Post>>(
      this.getEndpoint('/timeline/search/')
    );
  }
  get getBookmarkItems() {
    return this.getItemsRequest<Post, {}, TimeLinePaginated<Post>>(
      this.getEndpoint('/bookmarks')
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
  getReplies = (postId: number) => {
    const endpoint = this.getEndpoint(`/${postId}/replies/`);
    return this.getItemsRequest<Post, {}, TimeLinePaginated<Post>>(endpoint);
  };
  getRecommendedTag = () => {
    const endpoint = this.getEndpoint('/timeline/recommended/tags/');
    return this.client.get<{ key: string; doc_count: number }[]>(endpoint);
  };
}

export const Posts = {
  post: new PostAPIGenerator('/posts'),
};
