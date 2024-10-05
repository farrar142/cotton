import API from '#/api';
import { Message, MessageGroup } from '#/api/chats';
import useUser from '#/hooks/useUser';
import { useEffect, useMemo, useRef } from 'react';
import {
  atom,
  DefaultValue,
  selector,
  selectorFamily,
  useRecoilState,
} from 'recoil';

export type MessageGroupWithInCommingMessages = MessageGroup & {
  inComingMessages: Message[];
};

//메시지 그룹을 전역에서 컨트롤 할수 있도록 설정된 아톰
const messageGroupListAtom = atom<MessageGroup[]>({
  key: 'messageGroupListAtom',
  default: [],
});
const inComingMessageListAtom = atom<Message[]>({
  key: 'inComingMesageList',
  default: [],
});

const messageGroupListWihtInComingMessagesSelector = selector<
  MessageGroupWithInCommingMessages[]
>({
  key: 'messageGroupListSelector',
  get: ({ get }) => {
    const groupList = get(messageGroupListAtom);
    const inComings = get(inComingMessageListAtom);
    return groupList.map((group) => ({
      ...group,
      inComingMessages: inComings.filter((m) => m.group === group.id),
    }));
  },
  set: ({ set, get }, defaultValue) => {
    if (defaultValue instanceof DefaultValue) return;
    set(messageGroupListAtom, defaultValue);
  },
});

//rest api를 통하여 들어온 새로운 메시지그룹과, 기존의 메시지그룹간의 병합을 담당하는 훅
export const useMessageGroupList = () => {
  const [originGroup, setOriginGroup] = useRecoilState(messageGroupListAtom);
  const [groupList, setGroupList] = useRecoilState(
    messageGroupListWihtInComingMessagesSelector
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
  number
>({
  key: 'messageGroupAtomSelector',
  get:
    (key) =>
    ({ get }) => {
      const list = get(messageGroupListWihtInComingMessagesSelector);
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

  const checkAllMessagesAsReaded = () => {};

  return {
    group: (getter || {
      inComingMessages: [],
      ...group,
    }) as MessageGroupWithInCommingMessages,
    setGroup: setter,
  };
};

//웹소켓을 통하여 들어오는 메세지들을 메시지그룹 아톰에 분배

// const inComingMessagesAtomSelector = selector<Message[]>({
//   key: 'inComingMessageAtomSelector',
//   get: ({ get }) => {
//     const groups = get(messageGroupListAtom);
//     const inComingMessges = groups
//       .map((group) => group.inComingMessages)
//       .flatMap((r) => r);

//     return inComingMessges;
//   },
//   set: ({ set, get }, newValue) => {
//     if (newValue instanceof DefaultValue) return;
//     if (!newValue) return;
//     for (const message of newValue) {
//       const groupValue = get(messageGroupAtomSelector(message.group));
//       if (!groupValue) return;
//       //기존값이 뒤에와서 중복되는 경우에 새로들어온 값이 덮어쓰기를 해야됨
//       const filtered = filterDuplicate(
//         [message, ...groupValue.inComingMessages],
//         (item) => item.identifier
//       );
//       set(messageGroupAtomSelector(message.group), {
//         ...groupValue,
//         inComingMessages: filtered,
//       });
//     }
//   },
// });

export const useInComingMessages = () => {
  const [mesages, setMessages] = useRecoilState(inComingMessageListAtom);

  const checkAsReaded = () => {
    setMessages((p) => p.map((m) => ({ ...m, has_checked: true })));
  };

  return [mesages, setMessages, checkAsReaded] as const;
};

const newMessagesCount = atom({ key: 'newMessagesCount', default: 0 });
const countLoaded = atom({ key: 'countLoaded', default: false });
export const useUnreadedMessagesCount = () => {
  const [loaded, setLoaded] = useRecoilState(countLoaded);
  const [count, setCount] = useRecoilState(newMessagesCount);
  const [inComingMessages, _, checkAsReaded] = useInComingMessages();

  const [user, setUser] = useUser();

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
