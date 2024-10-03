import { Messages } from './chats';
import { client } from './client';
import { Misc } from './misc';
import { Notifications } from './notifications';
import { Posts } from './posts';
import { Relations } from './relations';
import { Auth, Users } from './users';

const API = {
  client,
  Auth,
  Users,
  Misc,
  Posts,
  Relations,
  Notifications,
  Messages,
};

export default API;
