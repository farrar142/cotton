import { client } from './client';

export type PaginationBase<T> = {
  results: T[];
};

export type Paginated<T> = PaginationBase<T> & {
  next?: string;
  prev?: string;
};
export type PageNumPaginated<T> = PaginationBase<T> & {
  total_page: number;
};

export class GenericAPI<
  M extends { id: number },
  U,
  Q = {},
  Pagination extends PaginationBase<M> = PaginationBase<M>
> {
  endpoint: string;
  client = client;
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }
  getEndpoint(suffix: string) {
    let url = this.endpoint + suffix;
    if (!url.endsWith('/')) url += '/';
    return url;
  }
  getItemsRequest<T, Q2, Pagination2 = PaginationBase<T>>(endpoint: string) {
    return (params?: Q2, options?: { page: number | string }) => {
      return client.get<
        Pagination2 extends PaginationBase<T> ? Pagination2 : T[]
      >(endpoint, {
        params: { ...params, ...options },
      });
    };
  }
  getItem = (id: number | string) => {
    const endpoint = this.getEndpoint(`/${id}`);
    return client.get<M>(endpoint);
  };
  getItems = (params?: Q, options?: { page: number | string }) => {
    const endpoint = this.getEndpoint('/');
    return this.getItemsRequest<M, Q, Pagination>(endpoint)(params, options);
  };
  getFlatItems = (params?: Q) => {
    const endpoint = this.getEndpoint('/flat/');
    return this.getItemsRequest<M, Q, {}>(endpoint)(params);
  };
  postItem = (data: U) => {
    const endpoint = this.getEndpoint('/');
    return client.post<M>(endpoint, data);
  };
  patchItem = (id: number | string, data: Partial<U>) => {
    const endpoint = this.getEndpoint(`/${id}`);
    return client.patch<M>(endpoint, data);
  };
  deleteItem = (id: number | string) => {
    const endpoint = this.getEndpoint(`/${id}`);
    return client.delete(endpoint);
  };
  getCount = (params?: Q) => {
    const endpoint = this.getEndpoint('/count/');
    return this.client.get<{ count: number }>(endpoint, { params });
  };
}

export type CreateGenericApi<
  M extends { id: number },
  U,
  Q = {},
  Pagination extends PaginationBase<M> = PaginationBase<M>
> = GenericAPI<M, U, Q, Pagination>;
