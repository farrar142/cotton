import { Paginated } from '#/api/general';
import { filterDuplicate } from '#/utils/arrays';
import { AxiosResponse } from 'axios';
import { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import useValue from '../useValue';
import { atomFamily, useRecoilState } from 'recoil';

const cursorPaginationAtom = atomFamily<any[], string>({
  key: 'cursorPaginationAtom',
  default: (key: string) => [],
});

const useCursorPaginationData = <T extends any>(
  key: string
): [T[], Dispatch<SetStateAction<T[]>>] =>
  useRecoilState(cursorPaginationAtom(key));

type Getter<T> = (
  queries?: {},
  params?: { cursor?: string }
) => Promise<AxiosResponse<Paginated<T>>>;

const getCursor = (url?: string) => {
  if (!url) return null;
  return new URLSearchParams(url.split('?')[1]).get('cursor');
};
const objectToStringKey = (obj: object) =>
  Object.entries(obj)
    .map(([k, v]) => `${k}=${v}`)
    .join(':');

export const useCursorPagination = <T extends { id: number }>({
  getter,
  params = {},
  apiKey,
}: {
  getter: Getter<T>;
  apiKey: string;
  params?: {};
}) => {
  const key = useValue(`${apiKey}:${objectToStringKey(params)}`);
  const [pages, setPages] = useCursorPaginationData<
    AxiosResponse<Paginated<T>>
  >(key.get);

  useEffect(() => {
    //디바운스
    const timeout = setTimeout(
      () => key.set(`${apiKey}:${objectToStringKey(params)}`),
      500
    );
    return () => clearTimeout(timeout);
  }, [apiKey, params]);

  useEffect(() => {
    //페이지가 존재시 패치 안함
    if (pages.length !== 0) return;
    getter(params).then((r) => setPages([r]));
  }, [key.get]);

  const fetchNext = () => {
    if (pages.length === 0) return;
    const cursor = getCursor(pages[pages.length - 1].data.next);
    if (cursor === null) return;
    getter(params, { cursor }).then((r) => setPages((p) => [...p, r]));
  };
  const data = useMemo(
    () => filterDuplicate(pages.map((r) => r.data.results).flatMap((r) => r)),
    [pages]
  );
  return { data, fetchNext };
};
