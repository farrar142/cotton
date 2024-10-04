import { Messages } from './chats';
import { AxiosWrapper, client } from './client';
import { Misc } from './misc';
import { Notifications } from './notifications';
import { Posts } from './posts';
import { Relations } from './relations';
import { Auth, Users } from './users';

class API {
  Auth = Auth;
  Users = Users;
  Misc = Misc;
  Posts = Posts;
  Relations = Relations;
  Notifications = Notifications;
  Messages = Messages;

  constructor() {}

  get client() {
    return new AxiosWrapper().client;
  }
}

// const API = {
//   client,
//   Auth,
//   Users,
//   Misc,
//   Posts,
//   Relations,
//   Notifications,
//   Messages,
// };

export default new API();
