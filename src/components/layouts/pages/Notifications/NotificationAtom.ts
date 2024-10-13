import API from '#/api';
import { NotificationType } from '#/api/notifications';
import { User } from '#/api/users/types';
import { filterDuplicate } from '#/utils/arrays';
import moment from 'moment';
import { useEffect, useMemo } from 'react';
import { atom, atomFamily, selectorFamily, useRecoilState } from 'recoil';

const notificationListAtom = atomFamily<NotificationType[], number>({
  key: 'notificationListAtom',
  default: (key) => [],
});

const inComingNotificationListAtom = atomFamily<NotificationType[], number>({
  key: 'inComingNotificationListAtom',
  default: (key) => [],
});
const unCheckedNotificationCountAtom = atomFamily<number, number>({
  key: 'unCheckedNotificationCountAtom',
  default: (key) => 0,
});
const notificationLoadedAtom = atomFamily<boolean, number>({
  key: 'notificationLoadedAtom',
  default: (key) => false,
});
const deletedNotificationAtom = atomFamily<number[], number>({
  key: 'deletedNotificationAtom',
  default: () => [],
});

export const useInComingNotificationList = (user: User) => {
  return useRecoilState(inComingNotificationListAtom(user.id));
};

export const useNotificationList = (user: User) => {
  const [notis, setNotis] = useRecoilState(notificationListAtom(user.id));
  const [inComings] = useRecoilState(inComingNotificationListAtom(user.id));
  const [deleted, setDeleted] = useRecoilState(
    deletedNotificationAtom(user.id)
  );
  const handleNotifications = (notifications: NotificationType[]) => {
    setNotis((p) => filterDuplicate([...p, ...notifications]));
  };
  const combined = useMemo(() => {
    const filtered = filterDuplicate([...inComings, ...notis]);
    const sorted = filtered.sort((a, b) =>
      moment(b.created_at).diff(a.created_at)
    );
    return sorted.filter((n) => !Boolean(deleted.find((d) => n.id === d)));
  }, [notis, inComings, deleted]);
  const removeNotifications = (ids: number[]) => {
    setDeleted((p) => [...p, ...ids]);
  };
  return [
    combined,
    setNotis,
    handleNotifications,
    removeNotifications,
  ] as const;
};

export const useUnCheckedNotification = (user: User) => {
  const [loaded, setLoaded] = useRecoilState(notificationLoadedAtom(user.id));
  const [unChecked, setUnChecked] = useRecoilState(
    unCheckedNotificationCountAtom(user.id)
  );
  const [inComings, setInComings] = useInComingNotificationList(user);

  useEffect(() => {
    if (loaded) return;
    const timeout = setTimeout(() => {
      setLoaded(true);
      API.Notifications.notification
        .getUnCheckedCount()
        .then((r) => r.data.count)
        .then(setUnChecked);
    }, 500);
    return () => clearTimeout(timeout);
  }, [user.id, loaded]);
  const resetCount = () => {
    setLoaded(false);
  };

  const check = (notification: NotificationType) => {
    if (notification.is_checked) return;
    API.Notifications.notification
      .checkNotification(notification.id)
      .then(() => {
        resetCount();
        setInComings((p) =>
          p.map((n) => {
            if (n.id === notification.id) return { ...n, is_checked: true };
            return n;
          })
        );
      });
  };

  const count = useMemo(
    () => unChecked + inComings.filter((n) => !n.is_checked).length,
    [unChecked, inComings]
  );
  return { count: count, resetCount, check };
};
