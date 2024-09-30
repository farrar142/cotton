import { ImageType } from '../commons/types';

type NotRegistered = {
  registerd_at?: undefined;
  is_registered: false;
};
type Registered = {
  registered_at: string;
  is_registered: true;
};
export type UserUpsert = {
  bio: string;
  nickname: string;
  profile_image?: ImageType;
  header_image?: ImageType;
};
type UserBase = UserUpsert & {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;

  followings_count: number;
  followers_count: number;

  is_following_to: boolean;
  if_followed_by: boolean;
  is_mutual_follow: boolean;
};

export type RegisteredUser = Registered & UserBase;
export type User = (NotRegistered | Registered) & UserBase;
