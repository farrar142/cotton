import { Paginated, TimeLinePaginated } from '#/api/general';
import { Post } from '#/api/posts';
import { Box, Button, Divider, Stack } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useEffect, useMemo, useRef } from 'react';
import { atomFamily, useRecoilState } from 'recoil';
import { PostItem } from './PostItem';
import { usePostList } from './hooks';
import { useKeepScrollPosition } from '#/hooks/useKeepScrollPosition';
import useValue from '#/hooks/useValue';
import { useObserver } from '#/hooks/useObserver';
import React from 'react';

const apiResponseAtom = atomFamily<
  AxiosResponse<TimeLinePaginated<Post>>[],
  string
>({
  key: 'apiResponseAto',
  default: [],
});

const useApiResponse = (key: string) => useRecoilState(apiResponseAtom(key));
[{ id: 1 }, { id: 1 }, { id: 1 }, { id: 2 }, { id: 2 }, { id: 2 }];
const useTimelinePagination = ({
  func,
  apiKey,
}: {
  func: (
    params?: {},
    options?: { offset?: string | number; direction?: 'next' | 'prev' }
  ) => Promise<AxiosResponse<TimeLinePaginated<Post>>>;
  apiKey: string;
}) => {
  const [pages, setPages] = useApiResponse(apiKey);
  const [newPages, setNewPages] = useApiResponse(`new:${apiKey}`);

  const filterDuplicate = (items: Post[]) => {
    const seenIds = new Set<number>();
    return items.filter((item, index, self) => {
      if (seenIds.has(item.id)) return false;
      seenIds.add(item.id);
      return true;
    });
  };

  useEffect(() => {
    func().then((r) => {
      setPages((p) => [...p, r]);
    });
  }, []);

  const getNextPage = () => {
    const lastPage = pages[pages.length - 1];
    if (!lastPage) return;
    if (!lastPage.data.next_offset) return;
    const next_offset = lastPage.data.next_offset;
    func({}, { offset: next_offset }).then((r) => setPages((p) => [...p, r]));
  };

  const patchPrevByLastPage = (page: AxiosResponse<TimeLinePaginated<any>>) => {
    if (!page.data.current_offset) return;
    func({}, { offset: page.data.current_offset, direction: 'prev' }).then(
      (r) => {
        if (r.data.results.length === 0) return;
        setNewPages((p) => [r, ...p]);
      }
    );
  };

  const getPrevPage = () => {
    console.log('get prev');
    if (!newPages[0]) {
      if (!pages[0]) return;
      patchPrevByLastPage(pages[0]);
    } else {
      patchPrevByLastPage(newPages[0]);
    }
  };

  useEffect(() => {
    const interval = setInterval(getPrevPage, 10000);
    return () => {
      clearInterval(interval);
    };
  }, [newPages, pages]);

  const data = useMemo<Post[]>(
    () =>
      filterDuplicate(
        pages.map(({ data: { results } }) => results).flatMap((r) => r)
      ),
    [pages]
  );
  const newData = useMemo<Post[]>(
    () =>
      filterDuplicate(
        newPages.map(({ data: { results } }) => results).flatMap((r) => r)
      ),
    [newPages]
  );

  const mergeDatas = () => {
    if (newData.length === 0) return;
    setPages((r) => [...newPages, ...r]);
    setNewPages([]);
  };

  return { data, newData, mergeDatas, getNextPage, getPrevPage };
};

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
}> = ({
  getter,
  type,
  keepScrollPosition = true,
  showParent = false,
  disableLatestRepost = false,
  params = {},
}) => {
  useKeepScrollPosition(type, keepScrollPosition);

  const {
    data: items,
    getNextPage,
    newData,
    mergeDatas,
  } = useTimelinePagination({
    func: getter,
    apiKey: type,
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
