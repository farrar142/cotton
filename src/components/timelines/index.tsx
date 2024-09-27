import { Paginated } from '#/api/general';
import { Post } from '#/api/posts';
import { Stack } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useEffect } from 'react';
import { atomFamily, useRecoilState } from 'recoil';
import { PostItem } from './PostItem';

const postListAtom = atomFamily<Post[], string>({
  key: 'postListAtom',
  default: (type: string) => [],
});
const usePostList = (type: string) => {
  return useRecoilState(postListAtom(type));
};
export const PostTimeline: React.FC<{
  getter: (
    params?: {},
    options?: { page: number | string }
  ) => Promise<AxiosResponse<Paginated<Post>>>;
  type: string;
}> = ({ getter, type }) => {
  const [items, setItems] = usePostList(type);
  useEffect(() => {
    if (0 < items.length) return;
    getter()
      .then(({ data }) => data.results)
      .then(setItems);
  }, []);

  return (
    <Stack spacing={1}>
      {items.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </Stack>
  );
};
