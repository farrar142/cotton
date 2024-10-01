import API from '#/api';
import { DraftOnPost } from '#/PostWriter/DraftEditor';

export const usePostWriteService = () => {
  const onPost: DraftOnPost = (text, blocks, images, parent, quote) => {
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
