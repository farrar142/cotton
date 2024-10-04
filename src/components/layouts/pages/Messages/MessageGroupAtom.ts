import { Message, MessageGroup } from '#/api/chats';
import { User } from '#/api/users/types';
import { useEffect } from 'react';
import { atomFamily, useRecoilState } from 'recoil';

const messageGroupAtom = atomFamily<MessageGroup | null, number>({
  key: 'messageGroupAtom',
  default: (key: number) => null,
});

export const useMessageGroupItem = (group: MessageGroup) => {
  const [getter, setter] = useRecoilState(messageGroupAtom(group.id));

  useEffect(() => {
    if (getter) return;
    setter(group);
  }, [group]);

  const onLastMessageUpdated = (message: Message) => {
    setter((p) => {
      if (!p) return null;
      return {
        ...p,
        latest_message: message.message,
        latest_message_created_at: message.created_at,
        latest_message_nickname: message.nickname,
        latest_message_user: message.user,
      };
    });
  };

  return { group: getter || group, setGroup: setter, onLastMessageUpdated };
};
