import API from '#/api';
import { Message, MessageGroup } from '#/api/chats';
import { User } from '#/api/users/types';
import useUser from '#/hooks/useUser';
import { useEffect, useMemo, useRef } from 'react';
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
const messageGroupListAtom = atomFamily<MessageGroup[], number>({
  key: 'messageGroupListAtom',
  default: (key) => [],
});
const inComingMessageListAtom = atomFamily<Message[], number>({
  key: 'inComingMesageList',
  default: (key) => [],
});

const messageGroupListWihtInComingMessagesSelector = selectorFamily<
  MessageGroupWithInCommingMessages[],
  number
>({
  key: 'messageGroupListSelector',
  get:
    (key) =>
    ({ get }) => {
      const groupList = get(messageGroupListAtom(key));
      const inComings = get(inComingMessageListAtom(key));
      return groupList.map((group) => ({
        ...group,
        inComingMessages: inComings.filter((m) => m.group === group.id),
      }));
    },
  set:
    (key) =>
    ({ set, get }, defaultValue) => {
      if (defaultValue instanceof DefaultValue) return;
      set(messageGroupListAtom(key), defaultValue);
    },
});

//rest api를 통하여 들어온 새로운 메시지그룹과, 기존의 메시지그룹간의 병합을 담당하는 훅
export const useMessageGroupList = (user: User) => {
  const [originGroup, setOriginGroup] = useRecoilState(
    messageGroupListAtom(user.id)
  );
  const [groupList, setGroupList] = useRecoilState(
    messageGroupListWihtInComingMessagesSelector(user.id)
  );
  const groupListRef = useRef<MessageGroup[]>([]);

  const handleGroupList = (newGroups: MessageGroup[]) => {
    setOriginGroup((p) => {
      const notAdded: MessageGroup[] = [];
      newGroups.forEach((newGroup) => {
        const exist = p.find((item) => item.id === newGroup.id);
        if (!exist) notAdded.push(newGroup);
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
  { user: number; group: number }
>({
  key: 'messageGroupAtomSelector',
  get:
    (key) =>
    ({ get }) => {
      const list = get(messageGroupListWihtInComingMessagesSelector(key.user));
      return list.find((item) => item.id === key.group);
    },
  set:
    (key) =>
    ({ get, set }, newValue) => {
      if (!newValue) return;
      if (newValue instanceof DefaultValue) return;
      const list = get(messageGroupListAtom(key.user));
      if (list.find((item) => item.id === newValue.id)) {
        set(messageGroupListAtom(key.user), [
          ...list.filter(({ id }, i) => id !== newValue.id),
          newValue,
        ]);
      } else {
        set(messageGroupListAtom(key.user), [...list, newValue]);
      }
    },
});

//개별 메시지 그룹을 사용하는 훅
export const useMessageGroupItem = (group: MessageGroup, user: User) => {
  const [getter, setter] = useRecoilState(
    messageGroupAtomSelector({ group: group.id, user: user.id })
  );

  useEffect(() => {
    if (getter) return;
    setter({ ...group, inComingMessages: [] });
  }, [group]);

  const checkAllMessagesAsReaded = () => {};

  return {
    group: (getter || {
      inComingMessages: [],
      ...group,
    }) as MessageGroupWithInCommingMessages,
    setGroup: setter,
  };
};

export const useInComingMessages = (user: User) => {
  const [mesages, setMessages] = useRecoilState(
    inComingMessageListAtom(user.id)
  );

  const checkAsReaded = () => {
    setMessages((p) => p.map((m) => ({ ...m, has_checked: true })));
  };

  return [mesages, setMessages, checkAsReaded] as const;
};

const newMessagesCount = atom({ key: 'newMessagesCount', default: 0 });
const countLoaded = atom({ key: 'countLoaded', default: false });

export const useUnreadedMessagesCount = (user: User) => {
  const [loaded, setLoaded] = useRecoilState(countLoaded);
  const [count, setCount] = useRecoilState(newMessagesCount);
  const [inComingMessages, _, checkAsReaded] = useInComingMessages(user);

  // const [user, setUser] = useUser();

  useEffect(() => {
    if (loaded) return;
    if (!user?.id) return;
    //중복요청방지
    const timeout = setTimeout(() => {
      setLoaded(true);
      API.Messages.message
        .getHasUnreadedMessages()
        .then((r) => r.data.count)
        .then((count) => {
          setCount(count);
          checkAsReaded();
        });
    }, 100);
    return () => clearTimeout(timeout);
  }, [user?.id, loaded]);

  const unreadedIncomings = useMemo(() => {
    return inComingMessages.filter((m) => !m.has_checked);
  }, [inComingMessages]);

  const resetCount = () => setLoaded(false);
  return { count: count + unreadedIncomings.length, resetCount };
};
