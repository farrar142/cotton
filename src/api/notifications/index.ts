import { GenericAPI, TimeLinePaginated } from '../general';
import { User } from '../users/types';

export type NotificationType = {
  id: number;
  user: User;
  from_user: User;
  text: string;
  mentioned_post: { mentioned_to: User; post: number };
  reposted_post: { post: number };
  favorited_post: { post: number };
  quoted_post: number;
  followed_user: number;
  replied_post: number;
  created_at: number;
};

export const Notifications = {
  notification: new GenericAPI<
    NotificationType,
    NotificationType,
    {},
    TimeLinePaginated<NotificationType>
  >('/notifications'),
};
