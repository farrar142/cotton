import { CreateGenericApi } from '#/api/general';
import { useEffect } from 'react';
import useValue from './useValue';
import { useRouter } from '#/hooks/useCRouter';

type PaginationOptions = {
  defaultPage: number;
  useQueryParam: boolean;
};

const setPage = (page: number) => {
  const url = new URL(window.location.href);
  url.searchParams.set('page', page.toString());
  window.history.pushState({}, '', url.toString());
};

export const usePagePagination = <M extends { id: number }, U>(
  api: CreateGenericApi<
    M,
    U,
    {},
    { total_page: number; results: M[] }
  >['getItems'],
  options?: Partial<PaginationOptions>
) => {
  const router = useRouter();
  const { defaultPage = 1, useQueryParam = false } = options || {};
  const [pages, currentPage, totalPage] = [
    useValue<M[]>([]),
    useValue(defaultPage),
    useValue(0),
  ];

  const getItems = (page: number) =>
    api({}, { page }).then(({ data }) => {
      pages.set(data.results);
      totalPage.set(data.total_page);
      currentPage.set(page);
      useQueryParam && setPage(page);
    });

  useEffect(() => {
    getItems(currentPage.get);
  }, [currentPage.get]);

  const onBackward = () => {
    console.log('on backward');
    if (useQueryParam == false) return;
    const url = new URL(window.location.href);
    const page = parseInt(url.searchParams.get('page') || '0');
    if (page === currentPage.get) return;
    getItems(page);
  };

  const onChange = (p: number) => {
    if (useQueryParam) {
      router.push({ query: { ...router.query, page: p } });
    } else {
      getItems(p);
    }
  };

  return {
    data: pages.get,
    onChange,
    totalPage: totalPage.get,
    currentPage: currentPage.get,
  };
};
