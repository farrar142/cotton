import { TimeLinePaginated } from '#/api/general';
import { Post } from '#/api/posts';
import useValue from '#/hooks/useValue';
import { filterDuplicate } from '#/utils/arrays';
import { AxiosResponse } from 'axios';
import { useEffect, useMemo } from 'react';
import { atomFamily, useRecoilState } from 'recoil';

const apiResponseAtom = atomFamily<
  AxiosResponse<TimeLinePaginated<Post>>[],
  string
>({
  key: 'apiResponseAto',
  default: [],
});

const useApiResponse = (key: string) => useRecoilState(apiResponseAtom(key));
[{ id: 1 }, { id: 1 }, { id: 1 }, { id: 2 }, { id: 2 }, { id: 2 }];
export const useTimelinePagination = ({
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

  useEffect(() => {
    const timeout = setTimeout(() => key.set(createKey()), 500);
    return () => clearTimeout(timeout);
  }, [apiKey, params]);

  useEffect(() => {
    if (pages.length !== 0) return;
    console.log('call?', key);
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
  }, [key.get]);

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
