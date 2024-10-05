import API from '#/api';
import { Message } from '#/api/chats';
import useUser from '#/hooks/useUser';
import { WS } from '#/utils/websockets';
import React, { useEffect } from 'react';
import {
  useInComingMessages,
  useMessageGroupList,
} from './layouts/pages/Messages/MessageGroupAtom';
import { User } from '#/api/users/types';

type WSMessageEvent = {
  type: 'message';
  message: Message;
};
type WSNotificationEvent = {
  type: 'notification';
  notification: number;
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

export const WebsocketEventListener: React.FC<{ user: User }> = ({ user }) => {
  const { onMessageReceived } = useMessageEventListener(user);
  useEffect(() => {
    if (!user) return;
    const ws = new WS<WSEvent>(`/ws/users/${user.id}/`);
    ws.onopen = () => {};
    ws.parseMessage((event) => {
      if (event.type === 'message') onMessageReceived(event.message);
    });
    return () => ws.close();
  }, [user?.id]);
  return <></>;
};
