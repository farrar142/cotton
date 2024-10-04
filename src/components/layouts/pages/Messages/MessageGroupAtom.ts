import { Message, MessageGroup } from '#/api/chats';
import { User } from '#/api/users/types';
import { useEffect, useRef } from 'react';
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

//메시지 그룹을 전역에서 컨트롤 할수 있도록 설정된 아톰
const messageGroupListAtom = atom<MessageGroupWithInCommingMessages[]>({
  key: 'messageGroupListAtom',
  default: [],
});

//rest api를 통하여 들어온 새로운 메시지그룹과, 기존의 메시지그룹간의 병합을 담당하는 훅
export const useMessageGroupList = () => {
  const [groupList, setGroupList] = useRecoilState(messageGroupListAtom);
  const groupListRef = useRef<MessageGroupWithInCommingMessages[]>([]);

  const handleGroupList = (newGroups: MessageGroup[]) => {
    setGroupList((p) => {
      const notAdded: MessageGroupWithInCommingMessages[] = [];
      newGroups.forEach((newGroup) => {
        const exist = p.find((item) => item.id === newGroup.id);
        if (!exist) notAdded.push({ ...newGroup, inComingMessages: [] });
      });
      return [...p, ...notAdded];
    });
  };

  useEffect(() => {
    groupListRef.current = groupList;
  }, [groupList]);
  return { groupList, handleGroupList, groupListRef };
};
//메시지 그룹아톰에서 특정한 그룹을 가져오는 셀렉터
const messageGroupAtomSelector = selectorFamily<
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
//개별 메시지 그룹을 사용하는 훅
export const useMessageGroupItem = (group: MessageGroup) => {
  const [getter, setter] = useRecoilState(messageGroupAtomSelector(group.id));

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

//웹소켓을 통하여 들어오는 메세지들을 메시지그룹 아톰에 분배
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
    const groupValue = get(messageGroupAtomSelector(newValue.group));
    if (!groupValue) return;
    set(messageGroupAtomSelector(newValue.group), {
      ...groupValue,
      inComingMessages: [...groupValue.inComingMessages, newValue],
    });
  },
});

export const useIncomingMessage = () =>
  useRecoilState(inComingMessageAtomSelector);
