import { TimeLinePaginated } from '#/api/general';
import { Post } from '#/api/posts';
import { useKeepScrollPosition } from '#/hooks/useKeepScrollPosition';
import { useObserver } from '#/hooks/useObserver';
import useValue from '#/hooks/useValue';
import { Box, Button, Divider, Stack } from '@mui/material';
import { AxiosResponse } from 'axios';
import React, {
  MutableRefObject,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { PostItem } from './PostItem';
import { useTimelinePagination } from './usePostPagination';

export const PostTimeline: React.FC<{
  getter: (
    params?: {},
    options?: { offset?: string | number }
  ) => Promise<AxiosResponse<TimeLinePaginated<Post>>>;
  type: string;
  keepScrollPosition?: boolean;
  showParent?: boolean;
  disableLatestRepost?: boolean;
  params?: {};
  fetchNew?: MutableRefObject<() => void>;
}> = ({
  getter,
  type,
  keepScrollPosition = true,
  showParent = false,
  disableLatestRepost = false,
  params = {},
  fetchNew,
}) => {
  useKeepScrollPosition(type, keepScrollPosition);

  const {
    data: items,
    getNextPage,
    newData,
    mergeDatas,
    getPrevPage,
  } = useTimelinePagination({
    func: getter,
    apiKey: type,
    params,
  });

  const observer = useObserver();
  const nextCallblock = useRef<HTMLDivElement>();
  useEffect(() => {
    if (!nextCallblock.current) return;
    const block = nextCallblock.current;
    observer.onIntersection(getNextPage);
    observer.observe(block);
    0;
    return () => observer.unobserve(block);
  }, [items]);

  //이전글 강제로 가져오는 기능
  const fetch = useValue(false);
  useImperativeHandle(
    fetchNew,
    () => () => {
      getPrevPage().then(() => fetch.set(true));
    },
    [getPrevPage, mergeDatas]
  );

  useEffect(() => {
    if (!fetch.get) return;
    const timeout = setTimeout(() => {
      mergeDatas();
      fetch.set(false);
    }, 100);
    return () => clearTimeout(timeout);
  }, [fetch.get, mergeDatas]);

  return (
    <Stack spacing={1}>
      {1 <= newData.length && (
        <>
          <Button sx={{ pt: 1.5 }} onClick={mergeDatas}>
            {newData.length} 게시글 보기
          </Button>
          <Divider />
        </>
      )}
      {items.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          showParent={showParent}
          disableLatestRepost={disableLatestRepost}
        />
      ))}
      <Box ref={nextCallblock} />
    </Stack>
  );
};
