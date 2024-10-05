import { Message } from '#/api/chats';
import { User } from '#/api/users/types';
import { WS } from '#/utils/websockets';
import React, { useEffect } from 'react';
import { useInComingMessages, useMessageGroupList } from './MessageGroupAtom';
import API from '#/api';
import useUser from '#/hooks/useUser';

type WSMessageEvent = {
  type: 'message';
  message: Message;
};
type WSNotificationEvent = {
  type: 'notification';
  notification: number;
};
type WSEvent = WSMessageEvent | WSNotificationEvent;
export const MessageListenerComponent: React.FC = () => {
  const [user] = useUser();
  const [_, setInComingMessage] = useInComingMessages();

  const { groupList, handleGroupList, groupListRef } = useMessageGroupList();
  useEffect(() => {
    if (!user) return;
    const ws = new WS<WSEvent>(`/ws/users/${user.id}/`);
    ws.onopen = () => {};
    ws.parseMessage((event) => {
      if (event.type === 'message') {
        const message = event.message;
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
      }
    });
    return () => ws.close();
  }, [user?.id]);
  return <></>;
};
