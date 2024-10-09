import API from '#/api';
import { Post } from '#/api/posts';
import { DraftOnPost } from '#/PostWriter/DraftEditor';
import { AxiosResponse } from 'axios';

type DP = Parameters<DraftOnPost>;
type Text = DP[0];
type Blocks = DP[1];
type Images = DP[2];
type Parent = DP[3];
type Quote = DP[4];

export const usePostWriteService = () => {
  const onPost = (
    text: Text,
    blocks: Blocks,
    images: Images,
    parent?: Parent,
    quote?: Quote
  ): Promise<AxiosResponse<Post>> => {
    const mentions = blocks
      .map((line) => line.filter((block) => block.type === 'mention'))
      .flatMap((block) => block)
      .map((block) => ({ mentioned_to: parseInt(block.id) }));
    return API.Posts.post.postItem({
      text,
      blocks,
      mentions,
      images,
      parent: parent?.id,
      origin: parent?.origin || parent?.id,
      quote: quote?.id,
    });
  };
  return { onPost };
};
