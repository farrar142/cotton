import { Image } from '@syncfusion/ej2-react-richtexteditor';

type NotRegistered = {
  registerd_at?: undefined;
  is_registered: false;
};
type Registered = {
  registered_at: string;
  is_registered: true;
};
export type User = (NotRegistered | Registered) & {
  id: number;
  username: string;
  nickname: string;
  bio: string;
  profile_image: Image;
  email: string;
  is_staff: boolean;

  followings_count: number;
  followers_count: number;
};
