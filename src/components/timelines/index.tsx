import { Paginated } from '#/api/general';
import { Post } from '#/api/posts';
import { Stack } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useEffect, useRef } from 'react';
import { atomFamily, useRecoilState } from 'recoil';
import { PostItem } from './PostItem';
import { usePostList } from './hooks';
import { useKeepScrollPosition } from '#/hooks/useKeepScrollPosition';

export const PostTimeline: React.FC<{
  getter: (
    params?: {},
    options?: { page: number | string }
  ) => Promise<AxiosResponse<Paginated<Post>>>;
  type: string;
  keepScrollPosition?: boolean;
  showParent?: boolean;
  disableLatestRepost?: boolean;
  params?: {};
}> = ({
  getter,
  type,
  keepScrollPosition = true,
  showParent = false,
  disableLatestRepost = false,
  params = {},
}) => {
  useKeepScrollPosition(type, keepScrollPosition);

  const [items, setItems] = usePostList(type);
  useEffect(() => {
    if (0 < items.length) return;
    getter(params)
      .then(({ data }) => data.results)
      .then(setItems);
    return () => setItems([]);
  }, [type]);

  return (
    <Stack spacing={1}>
      {items.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          showParent={showParent}
          disableLatestRepost={disableLatestRepost}
        />
      ))}
    </Stack>
  );
};
