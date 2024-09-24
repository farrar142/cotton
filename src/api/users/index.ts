import { client } from '../client';
import { Paginated } from '../general';
import { User } from './types';

type StringMap<Keys extends string[]> = Record<Keys[number], string>;

export const Auth = {
  signup: (params: StringMap<['email', 'username', 'password', 'password2']>) =>
    client.post<StringMap<['access', 'refresh']>>('/auth/signup/', params),
  signin: (params: StringMap<['email', 'password']>) =>
    client.post<StringMap<['access', 'refresh']>>('/auth/signin/', params),
  refresh: (params: StringMap<['refresh']>) =>
    client.post<StringMap<['access', 'refresh']>>('/auth/refresh/', params),
};

export const Users = {
  me: () => client.get<User>('/users/me/'),
  users: (queries?: { search?: string }) =>
    client.get<Paginated<User>>('/users/', { params: queries }),
};
