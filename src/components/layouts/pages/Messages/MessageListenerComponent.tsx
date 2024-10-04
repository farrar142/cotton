import { Message } from '#/api/chats';
import { User } from '#/api/users/types';
import { WS } from '#/utils/websockets';
import React, { useEffect } from 'react';
import { useIncomingMessage, useMessageGroupList } from './MessageGroupAtom';
import API from '#/api';
import useUser from '#/hooks/useUser';

export const MessageListenerComponent: React.FC = () => {
  const [user] = useUser();
  const [_, setInComingMessage] = useIncomingMessage();

  const { groupList, handleGroupList, groupListRef } = useMessageGroupList();
  useEffect(() => {
    if (!user) return;
    const ws = new WS<Message>(`/ws/message_users/${user.id}/`);
    ws.onopen = () => {};
    ws.parseMessage((message) => {
      const flattened = groupListRef.current;
      const matched = flattened.filter((group) => group.id === message.group);
      if (matched.length === 0) {
        console.log('not matched');
        API.Messages.message
          .getItem(message.group)
          .then((r) => r.data)
          .then((group) => {
            if (!group.latest_message) return;
            handleGroupList([group]);
          });
      } else {
        console.log('set incoming');
        setInComingMessage((p) => message);
      }
    });
    return () => ws.close();
  }, [user?.id]);
  return <></>;
};
