import { client } from '../client';
import { User } from '../users/types';

export const Relations = {
  getUserByUsername: (username: string) => {
    const endpoint = `/relations/${username}/`;
    return client.get<User>(endpoint);
  },
};
