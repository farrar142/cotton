import { ImageType } from '../commons/types';

type NotRegistered = {
  registerd_at?: undefined;
  is_registered: false;
};
type Registered = {
  registered_at: string;
  is_registered: true;
};
type UserBase = {
  id: number;
  username: string;
  nickname: string;
  bio: string;
  profile_image?: ImageType;
  header_image?: ImageType;
  email: string;
  is_staff: boolean;

  followings_count: number;
  followers_count: number;
};

export type RegisteredUser = Registered & UserBase;
export type User = (NotRegistered | Registered) & UserBase;
