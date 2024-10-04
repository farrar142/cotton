import { Message, MessageGroup } from '#/api/chats';
import { User } from '#/api/users/types';
import { useEffect } from 'react';
import {
  atom,
  atomFamily,
  DefaultValue,
  selector,
  selectorFamily,
  useRecoilState,
} from 'recoil';

export type MessageGroupWithInCommingMessages = MessageGroup & {
  inComingMessages: Message[];
};

const messageGroupListAtom = atom<MessageGroupWithInCommingMessages[]>({
  key: 'messageGroupListAtom',
  default: [],
});

export const useMessageGroupList = () => {
  const [groupList, setGroupList] = useRecoilState(messageGroupListAtom);

  const handleGroupList = (newGroups: MessageGroup[]) => {
    const notAdded: MessageGroupWithInCommingMessages[] = [];
    newGroups.forEach((newGroup) => {
      const exist = groupList.find((item) => item.id === newGroup.id);
      if (!exist) notAdded.push({ ...newGroup, inComingMessages: [] });
    });
    setGroupList((p) => [...p, ...notAdded]);
  };
  return { groupList, handleGroupList };
};

const messageGroupAtom = selectorFamily<
  MessageGroupWithInCommingMessages | undefined,
  number
>({
  key: 'messageGroupAtomSelector',
  get:
    (key) =>
    ({ get }) => {
      const list = get(messageGroupListAtom);
      return list.find((item) => item.id === key);
    },
  set:
    (key) =>
    ({ get, set }, newValue) => {
      if (!newValue) return;
      if (newValue instanceof DefaultValue) return;
      const list = get(messageGroupListAtom);
      if (list.find((item) => item.id === newValue.id)) {
        set(messageGroupListAtom, [
          ...list.filter(({ id }, i) => id !== newValue.id),
          newValue,
        ]);
      } else {
        set(messageGroupListAtom, [...list, newValue]);
      }
    },
});

// const messageGroupAtom = atomFamily<
//   MessageGroupWithInCommingMessages | undefined,
//   number
// >({
//   key: 'messageGroupAtom',
//   default: (key: number) => undefined,
// });

const inComingMessagesAtom = atom<Message | null>({
  key: 'inComingMessageAtom',
  default: null,
});

const inComingMessageAtomSelector = selector<Message | null>({
  key: 'inCominMessageAtomSelector',
  get: ({ get }) => get(inComingMessagesAtom),
  set: ({ set, get }, newValue) => {
    if (newValue instanceof DefaultValue) return;
    if (!newValue) return;
    const groupValue = get(messageGroupAtom(newValue.group));
    if (!groupValue) return;
    set(messageGroupAtom(newValue.group), {
      ...groupValue,
      inComingMessages: [...groupValue.inComingMessages, newValue],
    });
  },
});

export const useIncomingMessage = () =>
  useRecoilState(inComingMessageAtomSelector);

export const useMessageGroupItem = (group: MessageGroup) => {
  const [getter, setter] = useRecoilState(messageGroupAtom(group.id));

  useEffect(() => {
    if (getter) return;
    setter({ ...group, inComingMessages: [] });
  }, [group]);

  const onLastMessageUpdated = (message: Message) => {
    setter((p) => {
      if (!p) return undefined;
      return {
        ...p,
        latest_message: message.message,
        latest_message_created_at: message.created_at,
        latest_message_nickname: message.nickname,
        latest_message_user: message.user,
      };
    });
  };

  return {
    group: (getter || {
      inComingMessages: [],
      ...group,
    }) as MessageGroupWithInCommingMessages,
    setGroup: setter,
    onLastMessageUpdated,
  };
};
