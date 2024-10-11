import API from '#/api';
import { Message, MessageGroup } from '#/api/chats';
import { User } from '#/api/users/types';
import TextInput from '#/components/inputs/TextInput';
import { useCursorPagination } from '#/hooks/paginations/useCursorPagination';
import { useDebouncedFunction } from '#/hooks/useDebouncedEffect';
import { useObserver } from '#/hooks/useObserver';
import { useUserProfile } from '#/hooks/useUser';
import useValue from '#/hooks/useValue';
import { filterDuplicate } from '#/utils/arrays';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import moment from 'moment';
import React, { FormEventHandler, useEffect, useMemo, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import {
  MessageGroupWithInCommingMessages,
  useMessageGroupItem,
  useMessageGroupList,
  useUnreadedMessagesCount,
} from './MessageGroupAtom';
import { MessgeItem } from './MessageItem';
import { MergedMessage } from './types';
import {
  ArrowBack,
  ArrowDownward,
  InfoOutlined,
  Settings,
} from '@mui/icons-material';
import paths from '#/paths';
import NextLink from '#/components/NextLink';
import { glassmorphism } from '#/styles';
import { TabContext, TabPanel } from '@mui/lab';
import { SimpleProfileItem } from '#/components/SimpleProfileComponent';
import { usePromiseState } from '#/hooks/usePromiseState';
import { GroupMessageAddComponent } from './GroupMessageAddComponent';
import { useRouter } from '#/hooks/useCRouter';
import { useSnackbar } from 'notistack';

const getYearToMinuteString = (isostring: string) =>
  moment(isostring).format('YYYY-MM-DD-hh-mm');
const createDefaultMergedMessage = (message: Message) => ({
  user: message.user,
  messages: [message],
  identifier: message.identifier,
  minuteString: getYearToMinuteString(message.created_at),
});

export const MessageViewer: React.FC<{
  profile: User;
  group: MessageGroupWithInCommingMessages;
  onPanelChange: () => void;
}> = ({ profile, group, onPanelChange }) => {
  const [user] = useUserProfile(profile);

  const fetchBlock = useRef<HTMLElement>();
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const observer = useObserver({ rootMargin: '0px', threshold: 1 });
  const message = useValue('');
  const { data, isFirstFetchSuccess, fetchNext, hasNextPage } =
    useCursorPagination({
      getter: API.Messages.message.getMessages(group.id),
      apiKey: `${user.username}:messages:${group.id}`,
      params: { page_size: 20 },
    });

  const typedMessage = useValue<Message[]>([]);
  const isNewMessage = useValue(false);
  const showDownButton = useValue(false);

  const isScrollDown = () => {
    if (!chatBoxRef.current) return false;
    const c = chatBoxRef.current;
    if (c.clientHeight * 2 <= c.scrollHeight - c.scrollTop) return false;
    return true;
  };

  const scrollToDown = () => {
    if (!chatBoxRef.current) return;
    chatBoxRef.current.scroll({
      behavior: 'smooth',
      top: chatBoxRef.current.scrollHeight,
    });
  };

  const onMessageSend: FormEventHandler = (e) => {
    e.preventDefault();
    if (!message.get) return;
    const identifier = uuid();
    API.Messages.message.sendMessage(group.id, message.get, identifier);
    typedMessage.set((p) => [
      ...p,
      {
        id: -1,
        identifier,
        group: group.id,
        created_at: moment().toISOString(),
        message: message.get,
        user: user.id,
        nickname: profile.nickname,
        has_checked: true,
      },
    ]);
    message.set('');
  };

  const debounced = useDebouncedFunction();
  //이전 메세지 가져오기
  useEffect(() => {
    if (!fetchBlock.current) return;
    const block = fetchBlock.current;
    observer.observe(block);
    observer.onIntersection(() => debounced(fetchNext, 500));
    return () => observer.unobserve(block);
  }, [fetchNext]);

  const { merged: combinedMessages, sorted } = useMemo(() => {
    const messages = [
      ...[...data].reverse(),
      ...group.inComingMessages,
      ...typedMessage.get,
    ];
    const filtered = filterDuplicate(messages, (e) => e.identifier);
    const sorted = filtered.sort((a, b) =>
      moment(a.created_at).diff(b.created_at)
    );
    const merged: MergedMessage[] = [];
    sorted.forEach((message) => {
      if (merged.length === 0) {
        merged.push(createDefaultMergedMessage(message));
        return;
      }
      const lastMessage = merged[merged.length - 1];
      if (
        lastMessage.user === message.user &&
        lastMessage.minuteString === getYearToMinuteString(message.created_at)
      ) {
        lastMessage.messages.push(message);
      } else {
        merged.push(createDefaultMergedMessage(message));
      }
    });
    return { merged, sorted };
  }, [data, group.inComingMessages, typedMessage.get]);

  useEffect(() => {
    //새 메세지가 올 때, 화면 아래쪽에 있을시 자동으로 스크롤 다운
    if (group.inComingMessages.length === 0 && typedMessage.get.length === 0)
      return;
    if (isScrollDown()) setTimeout(scrollToDown, 100);
    else isNewMessage.set(true);
  }, [group.inComingMessages.length, typedMessage.get]);

  useEffect(() => {
    //새 메세지 확인버튼을 띄우는 로직
    if (!isNewMessage.get || !chatBoxRef.current) return;
    const isNewMessageButtonShowCheck = () => {
      if (!isScrollDown()) return;
      isNewMessage.set(false);
    };
    const c = chatBoxRef.current;
    c.addEventListener('scroll', isNewMessageButtonShowCheck);
    return () => c.removeEventListener('scroll', isNewMessageButtonShowCheck);
  }, [isNewMessage.get]);

  useEffect(() => {
    //화면 맨아래로 버튼을 띄우는 로직
    if (!chatBoxRef.current) return;
    const isDownButtonShowCheck = () => {
      if (isScrollDown()) return showDownButton.set(false);
      showDownButton.set(true);
    };
    const c = chatBoxRef.current;
    c.addEventListener('scroll', isDownButtonShowCheck);
    return () => c.removeEventListener('scroll', isDownButtonShowCheck);
  }, []);

  const lastScrollHeight = useRef(0);
  useEffect(() => {
    //이전 메세지 로딩시 스크롤 유지
    const c = chatBoxRef.current;
    if (!c) return;
    c.scroll({
      behavior: 'instant',
      top: c.scrollHeight - lastScrollHeight.current,
    });

    lastScrollHeight.current = c.scrollHeight;
  }, [data]);

  const { resetCount } = useUnreadedMessagesCount(user);
  useEffect(() => {
    //메세지 확인 관련
    const timeout = setTimeout(
      () => API.Messages.message.checkMessages(group.id).then(resetCount),
      // .then(() => checkAllMessagesAsReaded()),
      1000
    );
    return () => clearTimeout(timeout);
  }, [group.inComingMessages.length]);

  return (
    <Box
      // minWidth={isMd ? undefined : theme.breakpoints.values.sm}
      width='100%'
      height='100%'
      display='flex'
      flexDirection='column'
      component='form'
      onSubmit={onMessageSend}
      sx={{
        borderColor: 'divider',
        borderWidth: 1,
        borderStyle: 'solid',
        borderBottomWidth: 0,
      }}
    >
      <Stack
        flex={1}
        spacing={1}
        position='relative'
        overflow='scroll'
        className='hide-scrollbar'
        ref={chatBoxRef}
      >
        <Stack
          position='sticky'
          top={0}
          width='100%'
          direction='row'
          alignItems='center'
          px={1}
          spacing={1}
          sx={glassmorphism}
        >
          <NextLink href={paths.groupMessages}>
            <IconButton>
              <ArrowBack />
            </IconButton>
          </NextLink>
          <Typography flex={1}>
            {group.title ||
              group.attendants
                .filter((u) => u.id !== user?.id)
                .map((u) => u.nickname)
                .join(', ')}
          </Typography>
          <IconButton onClick={onPanelChange}>
            <InfoOutlined />
          </IconButton>
        </Stack>
        <Box flex={1} />
        {hasNextPage && (
          <>
            <Box display='flex' justifyContent='center'>
              <CircularProgress />
            </Box>
            <Box ref={fetchBlock} height={200}></Box>
          </>
        )}
        {combinedMessages.map((m) => (
          <MessgeItem key={m.identifier} messages={m} me={user} />
        ))}
        {showDownButton.get && (
          <Box
            position='sticky'
            bottom='5%'
            display='flex'
            justifyContent='center'
            onClick={() => {
              scrollToDown();
              showDownButton.set(false);
            }}
          >
            <IconButton>
              <ArrowDownward />
            </IconButton>
          </Box>
        )}
        {isNewMessage.get && (
          <Box
            position='sticky'
            bottom='5%'
            display='flex'
            justifyContent='center'
            onClick={() => {
              scrollToDown();
              isNewMessage.set(false);
            }}
          >
            <Button
              variant='contained'
              sx={{
                maxWidth: 128,
              }}
            >
              새 메세지 보기
            </Button>
          </Box>
        )}
      </Stack>
      <Divider />
      <TextInput
        label='새 쪽지 작성하기'
        value={message.get}
        onChange={message.onTextChange}
        size='small'
      />
      <Button type='submit' sx={{ display: 'none', visibility: 'hidden' }} />
    </Box>
  );
};

export const MessageGroupInfoPanel: React.FC<{
  group: MessageGroup;
  profile: User;
  onPanelChange: () => void;
}> = ({ group, profile, onPanelChange }) => {
  const router = useRouter();
  const snackBar = useSnackbar();
  const { replaceGroup } = useMessageGroupList(profile);
  const title = useValue(group.title || '');
  const { done, wrapper } = usePromiseState();
  const addUserOpen = useValue(false);
  const onEditTitle = wrapper(async () => {
    return API.Messages.message.changeTitle(group.id, title.get);
  });
  const onExit = () => {
    return API.Messages.message.exitRoom(group.id).then(() => {
      router.push(paths.groupMessages);
      replaceGroup({
        ...group,
        attendants: group.attendants.filter((u) => u.id !== profile.id),
      });
    });
  };
  const onAddUser = (users: User[]) => {
    return API.Messages.message
      .addUsers(group.id, {
        users: users.map((u) => u.id),
      })
      .then(addUserOpen.wrap(false))
      .catch((e) => {
        if (e.status === 400) {
          const detail: Record<string, string[]> = e.response.data.detail;
          Object.entries(detail).forEach(([key, values]) => {
            values.forEach((value) => {
              snackBar.enqueueSnackbar(value, { variant: 'error' });
            });
          });
        }
      });
  };
  return (
    <Stack spacing={2}>
      <Stack
        position='sticky'
        top={0}
        width='100%'
        direction='row'
        alignItems='center'
      >
        <IconButton onClick={onPanelChange}>
          <ArrowBack />
        </IconButton>
        <Typography flex={1} variant='h5'>
          Group Info
        </Typography>
      </Stack>
      <Box px={2} display='flex' flexDirection='row' alignItems='center'>
        <TextInput
          value={title.get}
          onChange={title.onTextChange}
          placeholder={group.attendants
            .filter((u) => u.id !== profile.id)
            .map((u) => u.nickname)
            .join(', ')}
          size='small'
          variant='standard'
          sx={{ flex: 1 }}
          slotProps={{ input: { disableUnderline: true } }}
        />
        <Button disabled={!title.get || !done.get} onClick={onEditTitle}>
          Edit
        </Button>
      </Box>
      <Divider />
      <Stack px={2} spacing={1}>
        <Typography variant='h5'>Participants</Typography>
        <Stack>
          {group.attendants
            .filter((u) => u.id !== profile.id)
            .map((user) => (
              <SimpleProfileItem profile={user} key={user.id} />
            ))}
          <Button onClick={addUserOpen.wrap(true)}>Add User</Button>
        </Stack>
        <Divider />
        <Stack px={2}>
          <Button color='error' onClick={onExit}>
            Exit Message Group
          </Button>
        </Stack>
      </Stack>
      <GroupMessageAddComponent
        open={addUserOpen.get}
        onClose={addUserOpen.wrap(false)}
        me={profile}
        onPost={onAddUser}
        title={'Add User'}
        postButtonName='Add'
        exclude_ids={group.attendants.map((u) => u.id).join(',')}
      />
    </Stack>
  );
};

export const MessageViewerContainer: React.FC<{
  group: MessageGroup;
  user: User;
}> = ({ group: _group, user: profile }) => {
  const { group } = useMessageGroupItem(_group, profile);
  const tabValue = useValue('0');
  return (
    <Box minHeight='100vh' height='100vh' maxWidth='100%'>
      <TabContext value={tabValue.get}>
        <TabPanel
          value='0'
          sx={{ p: 0, minHeight: '100%', height: '100vh', maxWidth: '100%' }}
        >
          <MessageViewer
            group={group}
            profile={profile}
            onPanelChange={() => tabValue.set('1')}
          />
        </TabPanel>
        <TabPanel
          value='1'
          sx={{ p: 0, minHeight: '100%', height: '100vh', maxWidth: '100%' }}
        >
          <MessageGroupInfoPanel
            group={group}
            profile={profile}
            onPanelChange={() => tabValue.set('0')}
          />
        </TabPanel>
      </TabContext>
    </Box>
  );
};
