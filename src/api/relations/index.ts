import { client } from '../client';
import { SimpleResponse } from '../general';
import { User } from '../users/types';

export const Relations = {
  getUserByUsername: (username: string) => {
    const endpoint = `/relations/${username}/`;
    return client.get<User>(endpoint);
  },
  followUser: (userId: number) => {
    const endpoint = `/relations/${userId}/follow/`;
    return client.post<SimpleResponse>(endpoint);
  },
  unfollowUser: (userId: number) => {
    const endpoint = `/relations/${userId}/follow/`;
    return client.delete<SimpleResponse>(endpoint);
  },
};
