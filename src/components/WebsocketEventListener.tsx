import API from '#/api';
import { Message, MessageGroup } from '#/api/chats';
import useUser, { useAuthToken } from '#/hooks/useUser';
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
import { client } from '#/api/client';

type WSMessageEvent = {
  type: 'message';
  message: Message;
};
type WSGroupEvent = {
  type: 'group';
  state: 'changed';
  id: number;
};
type WSNotificationEvent = {
  type: 'notification';
  notification: NotificationType;
};
type WSAuthorizationEvent = {
  type: 'authorization';
  result: false;
};
type WSEvent =
  | WSMessageEvent
  | WSNotificationEvent
  | WSAuthorizationEvent
  | WSGroupEvent;

const useMessageEventListener = (user: User) => {
  const [_, setInComingMessage] = useInComingMessages(user);

  const { groupList, replaceGroup, removeGroup, groupListRef } =
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
          replaceGroup(group);
        });
    }
    setInComingMessage((p) => [...p, message]);
  };
  const onGroupChanged = (groupId: number) => {
    API.Messages.message
      .getItem(groupId)
      .then((r) => r.data)
      .then((group) => {
        if (!group.latest_message) return;
        if (group.attendants.find((u) => u.id === user.id)) {
          replaceGroup(group);
        } else {
          removeGroup(group);
        }
      });
  };
  return { onMessageReceived, onGroupChanged };
};
const useNotificationEventListener = (user: User) => {
  const [inComings, setInComings] = useInComingNotificationList(user);
  const onNotificationReceived = (notification: NotificationType) => {
    setInComings((p) => [...p, notification]);
  };
  return { onNotificationReceived };
};

export const WebsocketEventListener: React.FC<{ user: User }> = ({ user }) => {
  const { onMessageReceived, onGroupChanged } = useMessageEventListener(user);
  const { onNotificationReceived } = useNotificationEventListener(user);
  const [token] = useAuthToken();
  const watingReconnect = useValue(false);
  const waiting = useRef(1000);

  useEffect(() => {
    if (!user) return;
    if (!token.access) return;
    const { access } = client.instance.getTokens();
    const ws = new WS<WSEvent>(`/ws/users/${user.id}/`);
    ws.onopen = () => {
      ws.send(JSON.stringify({ access: `${access}` }));
    };
    ws.parseMessage((event) => {
      console.log(event);
      if (event.type === 'message') onMessageReceived(event.message);
      else if (event.type === 'notification')
        onNotificationReceived(event.notification);
      else if (event.type === 'authorization') {
        if (!event.result) {
          ws.onclose = () => {};
          ws.close();
        }
      } else if (event.type === 'group') onGroupChanged(event.id);
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
  }, [user?.id, watingReconnect.get, token.access]);
  return <></>;
};
