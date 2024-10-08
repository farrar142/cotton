import { client } from '../client';
import { Paginated } from '../general';
import { User, UserUpsert } from './types';

type StringMap<Keys extends string[]> = Record<Keys[number], string>;

export const Auth = {
  kakaosignin: (params: StringMap<['code', 'redirect_uri']>) =>
    client.post<StringMap<['access', 'refresh']>>(
      '/auth/kakao/signin/',
      params
    ),
  signup: (params: StringMap<['email', 'username', 'password', 'password2']>) =>
    client.post<StringMap<['access', 'refresh']>>('/auth/signup/', params),
  signin: (params: StringMap<['email', 'password']>) =>
    client.post<StringMap<['access', 'refresh']>>('/auth/signin/', params),
  refresh: (params: StringMap<['refresh']>) =>
    client.post<StringMap<['access', 'refresh']>>('/auth/refresh/', params),
  send_email: (tokens: { access: string }) => {
    return client.post('/auth/send_register_email/', tokens);
  },
  register_email: (code_key: { code_key: string }) => {
    return client.post<StringMap<['access', 'refresh']>>(
      '/auth/register/',
      code_key
    );
  },
};

export const Users = {
  me: () => client.get<User>('/users/me/'),
  user: (userId: number | string) => client.get<User>(`/users/${userId}/`),
  users: (queries?: { search?: string }, params?: { cursor?: string }) =>
    client.get<Paginated<User>>('/users/', {
      params: { ...queries, ...params },
    }),
  patchItem: (id: number, params: Partial<UserUpsert>) => {
    return client.patch<User>(`/users/${id}/`, params);
  },
};
