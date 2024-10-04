import { TimeLinePaginated } from '#/api/general';
import { Post } from '#/api/posts';
import useValue from '#/hooks/useValue';
import { filterDuplicate } from '#/utils/arrays';
import { AxiosResponse } from 'axios';
import { Dispatch, SetStateAction, useEffect, useMemo, useRef } from 'react';
import { atomFamily, useRecoilState } from 'recoil';

const apiResponseAtom = atomFamily<TimeLinePaginated<{ id: number }>[], string>(
  {
    key: 'apiResponseAto',
    default: [],
  }
);

const useApiResponse = <T extends { id: number }>(
  key: string
): [
  TimeLinePaginated<T>[],
  Dispatch<SetStateAction<TimeLinePaginated<T>[]>>
  //@ts-ignore
] => useRecoilState(apiResponseAtom(key));

export const useTimelinePagination = <T extends { id: number }>({
  func,
  apiKey,
  params = {},
}: {
  func: (
    params?: {},
    options?: { offset?: string | number; direction?: 'next' | 'prev' }
  ) => Promise<AxiosResponse<TimeLinePaginated<T>>>;
  apiKey: string;
  params?: {};
}) => {
  const createKey = () =>
    `${apiKey}:${Object.entries(params)
      .flatMap((r) => r.join('='))
      .join(':')}`;
  const key = useValue(createKey());
  const pagesRef = useRef<TimeLinePaginated<T>[]>([]);
  const [pages, setPages] = useApiResponse<T>(key.get);
  const [newPages, setNewPages] = useApiResponse<T>(`new:${key.get}`);

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
            setPages((p) => [...p, r.data]);
            return clearInterval(interval);
          }
        }),
      5000
    );
    func(params).then((r) => {
      if (r.data.results.length !== 0) {
        setPages((p) => [...p, r.data]);
        return clearInterval(interval);
      }
    });
    return () => clearInterval(interval);
  }, [key.get]);

  const getNextPage = () => {
    const lastPage = pages[pages.length - 1];
    if (!lastPage) return;
    if (!lastPage.next_offset) return;
    const next_offset = lastPage.next_offset;
    func(params, { offset: next_offset }).then((r) =>
      setPages((p) => [...p, r.data])
    );
  };

  const patchPrevByLastPage = (page: TimeLinePaginated<any>) => {
    if (!page.current_offset) return;
    return func(params, {
      offset: page.current_offset,
      direction: 'prev',
    }).then((r) => {
      if (r.data.results.length === 0) return;
      setNewPages((p) => [r.data, ...p]);
    });
  };

  const getPrevPage = async () => {
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

  useEffect(() => {
    pagesRef.current = pages;
  }, [pages]);

  const data = useMemo<T[]>(
    () =>
      filterDuplicate(pages.map(({ results }) => results).flatMap((r) => r)),
    [pages]
  );
  const newData = useMemo<T[]>(
    () =>
      filterDuplicate(newPages.map(({ results }) => results).flatMap((r) => r)),
    [newPages]
  );

  const mergeDatas = () => {
    if (newData.length === 0) return;
    setPages((r) => [...newPages, ...r]);
    setNewPages([]);
  };

  return {
    data,
    setPages,
    newData,
    mergeDatas,
    getNextPage,
    getPrevPage,
    pagesRef,
  };
};
