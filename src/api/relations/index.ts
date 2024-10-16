import { client } from '../client';
import { Paginated, SimpleResponse } from '../general';
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
  getFollowers:
    (userId: number) => (queries?: {}, params?: { cursor?: string }) => {
      const endpoint = `/relations/${userId}/followers/`;
      return client.get<Paginated<User>>(endpoint, {
        params: { ...params, ...queries },
      });
    },
  getFollowings:
    (userId: number) => (queries?: {}, params?: { cursor?: string }) => {
      const endpoint = `/relations/${userId}/followings/`;
      return client.get<Paginated<User>>(endpoint, {
        params: { ...params, ...queries },
      });
    },
  getRecommendedUser: () => {
    const endpoint = `/relations/users/recommended/`;
    return client.get<Paginated<User>>(endpoint);
  },
};
