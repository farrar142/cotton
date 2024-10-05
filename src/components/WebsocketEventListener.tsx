import API from '#/api';
import { Message } from '#/api/chats';
import useUser from '#/hooks/useUser';
import { WS } from '#/utils/websockets';
import React, { useEffect, useRef } from 'react';
import {
  useInComingMessages,
  useMessageGroupList,
} from './layouts/pages/Messages/MessageGroupAtom';
import { User } from '#/api/users/types';
import { useInComingNotificationList } from './layouts/pages/Notifications/NotificationAtom';
import { NotificationType } from '#/api/notifications';
import useValue from '#/hooks/useValue';
import { Button } from '@mui/material';

type WSMessageEvent = {
  type: 'message';
  message: Message;
};
type WSNotificationEvent = {
  type: 'notification';
  notification: NotificationType;
};
type WSEvent = WSMessageEvent | WSNotificationEvent;

const useMessageEventListener = (user: User) => {
  const [_, setInComingMessage] = useInComingMessages(user);

  const { groupList, handleGroupList, groupListRef } =
    useMessageGroupList(user);

  const onMessageReceived = (message: Message) => {
    const flattened = groupListRef.current;
    const matched = flattened.filter((group) => group.id === message.group);
    if (matched.length === 0) {
      console.log('not matched');
      API.Messages.message
        .getItem(message.group)
        .then((r) => r.data)
        .then((group) => {
          if (!group.latest_message) return;
          handleGroupList([{ ...group }]);
        });
    }
    setInComingMessage((p) => [...p, message]);
  };
  return { onMessageReceived };
};
const useNotificationEventListener = (user: User) => {
  const [inComings, setInComings] = useInComingNotificationList(user);
  const onNotificationReceived = (notification: NotificationType) => {
    setInComings((p) => [...p, notification]);
  };
  return { onNotificationReceived };
};

export const WebsocketEventListener: React.FC<{ user: User }> = ({ user }) => {
  const { onMessageReceived } = useMessageEventListener(user);
  const { onNotificationReceived } = useNotificationEventListener(user);
  const watingReconnect = useValue(false);
  const waiting = useRef(1000);

  useEffect(() => {
    if (!user) return;
    const ws = new WS<WSEvent>(`/ws/users/${user.id}/`);
    ws.onopen = () => {};
    ws.parseMessage((event) => {
      if (event.type === 'message') onMessageReceived(event.message);
      else if (event.type === 'notification')
        onNotificationReceived(event.notification);
    });
    ws.onclose = () => {
      setTimeout(() => {
        watingReconnect.set((p) => !p);
        if (waiting.current <= 10000) {
          waiting.current += 1000;
        }
      }, waiting.current);
    };
    return () => {
      ws.onclose = () => {};
      ws.close();
    };
  }, [user?.id, watingReconnect.get]);
  return <></>;
};
