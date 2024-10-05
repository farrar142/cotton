import { GenericAPI, SimpleResponse, TimeLinePaginated } from '../general';
import { User } from '../users/types';

export type NotificationType = {
  id: number;
  user: User;
  from_user: User;
  text: string;
  mentioned_post?: { mentioned_to: User; post: number };
  reposted_post?: { post: number };
  favorited_post?: { post: number };
  quoted_post?: number;
  followed_user?: number;
  replied_post?: number;
  created_at: number;
  is_checked: boolean;
};

class NotificationAPIGenerator extends GenericAPI<
  NotificationType,
  NotificationType,
  {},
  TimeLinePaginated<NotificationType>
> {
  getUnCheckedCount = () => {
    const endpoint = this.getEndpoint('/unchecked_count/');
    return this.client.get<{ count: number }>(endpoint);
  };
  checkNotification = (notificationId: number | string) => {
    const endpoint = this.getEndpoint(`/${notificationId}/check/`);
    return this.client.post<SimpleResponse>(endpoint, {});
  };
}

export const Notifications = {
  notification: new NotificationAPIGenerator('/notifications'),
};
