import { Paginated, TimeLinePaginated } from '#/api/general';
import { Post } from '#/api/posts';
import { Box, Button, Divider, Stack } from '@mui/material';
import { AxiosResponse } from 'axios';
import {
  MutableRefObject,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
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
  params = {},
}: {
  func: (
    params?: {},
    options?: { offset?: string | number; direction?: 'next' | 'prev' }
  ) => Promise<AxiosResponse<TimeLinePaginated<Post>>>;
  apiKey: string;
  params?: {};
}) => {
  const createKey = () =>
    `${apiKey}:${Object.entries(params)
      .flatMap((r) => r.join('='))
      .join(':')}`;
  const key = useValue(createKey());
  const [pages, setPages] = useApiResponse(key.get);
  const [newPages, setNewPages] = useApiResponse(`new:${key.get}`);

  const filterDuplicate = (items: Post[]) => {
    const seenIds = new Set<number>();
    return items.filter((item, index, self) => {
      if (seenIds.has(item.id)) return false;
      seenIds.add(item.id);
      return true;
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => key.set(createKey()), 500);
    return () => clearTimeout(timeout);
  }, [apiKey, params]);

  useEffect(() => {
    if (pages.length !== 0) return;
    //데이터가 없을 시 생길때까지 계속 패치
    const interval = setInterval(
      () =>
        func(params).then((r) => {
          if (r.data.results.length !== 0) {
            setPages((p) => [...p, r]);
            return clearInterval(interval);
          }
        }),
      5000
    );
    func(params).then((r) => {
      if (r.data.results.length !== 0) {
        setPages((p) => [...p, r]);
        return clearInterval(interval);
      }
    });
    return () => clearInterval(interval);
  }, [key]);

  const getNextPage = () => {
    const lastPage = pages[pages.length - 1];
    if (!lastPage) return;
    if (!lastPage.data.next_offset) return;
    const next_offset = lastPage.data.next_offset;
    func(params, { offset: next_offset }).then((r) =>
      setPages((p) => [...p, r])
    );
  };

  const patchPrevByLastPage = (page: AxiosResponse<TimeLinePaginated<any>>) => {
    if (!page.data.current_offset) return;
    return func(params, {
      offset: page.data.current_offset,
      direction: 'prev',
    }).then((r) => {
      if (r.data.results.length === 0) return;
      setNewPages((p) => [r, ...p]);
    });
  };

  const getPrevPage = async () => {
    console.log('get prev');
    if (!newPages[0]) {
      if (!pages[0]) {
        getNextPage();
        return;
      }
      return patchPrevByLastPage(pages[0]);
    } else {
      return patchPrevByLastPage(newPages[0]);
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
