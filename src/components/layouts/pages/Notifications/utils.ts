import { NotificationType } from '#/api/notifications';

export const replaceNotificationText = (noti: NotificationType) =>
  noti.text.replace('{{nickname}}', noti.from_user.nickname);
