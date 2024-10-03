import API from '#/api';
import { Message, MessageGroup } from '#/api/chats';
import { User } from '#/api/users/types';
import TextInput from '#/components/inputs/TextInput';
import getInitialPropsWrapper from '#/functions/getInitialPropsWrapper';
import { LoginRequired } from '#/functions/getInitialPropsWrapper/middleware';
import { useCursorPagination } from '#/hooks/paginations/useCursorPagination';
import useUser, { useUserProfile } from '#/hooks/useUser';
import useValue from '#/hooks/useValue';
import { filterDuplicate } from '#/utils/arrays';
import { WS } from '#/utils/websockets';
import { Box, Button, Stack, useTheme } from '@mui/material';
import moment from 'moment';
import React, { FormEventHandler, useEffect, useMemo, useRef } from 'react';
import { v4 as uuid } from 'uuid';
// send_message를 하면
// 웹소켓으로 message오브젝트가 와야됨

const MessageGroupPage: ExtendedNextPage<{
  group: MessageGroup;
  user?: User;
}> = ({ group, user: profile }) => {
  if (!profile) throw Error;
  const [user] = useUserProfile(profile);
  const theme = useTheme();
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const message = useValue('');
  const { data, isFirstFetchSuccess } = useCursorPagination({
    getter: API.Messages.message.getMessages(group.id),
    apiKey: `messages:${group.id}`,
  });
  const incomingMessages = useValue<Message[]>([]);
  const typedMessage = useValue<Message[]>([]);

  useEffect(() => {
    const ws = new WS<Message>(`/ws/message_groups/${group.id}/`);
    ws.onopen = (e) => {};
    ws.parseMessage((e) => {
      incomingMessages.set((p) => [...p, e]);
    });
  }, []);

  const scrollToDown = () => {
    if (!chatBoxRef.current) return;

    chatBoxRef.current.scroll({
      behavior: 'smooth',
      top: chatBoxRef.current.clientHeight,
    });
  };
  useEffect(() => {
    const timeout = setTimeout(scrollToDown, 100);
    return () => clearTimeout(timeout);
  }, [isFirstFetchSuccess]);

  const onMessageSend: FormEventHandler = (e) => {
    e.preventDefault();
    const identifier = uuid();
    API.Messages.message
      .sendMessage(group.id, message.get, identifier)
      .then(console.log);
    typedMessage.set((p) => [
      ...p,
      {
        id: -1,
        identifier,
        created_at: moment().toISOString(),
        message: message.get,
        user: user.id,
      },
    ]);
    message.set('');
  };
  const combinedMessages = useMemo(() => {
    const messages = [
      ...[...data].reverse(),
      ...incomingMessages.get,
      ...typedMessage.get,
    ];
    const filtered = filterDuplicate(messages, (e) => e.identifier);
    return filtered.sort((a, b) => moment(b.created_at).diff(b.created_at));
  }, [data, incomingMessages, typedMessage]);

  return (
    <Stack direction='row' minHeight='100vh' height='100vh'>
      <Box flex={1}></Box>
      <Box
        minWidth={theme.breakpoints.values.sm}
        height='100%'
        border='1px solid red'
        display='flex'
        flexDirection='column'
        component='form'
        onSubmit={onMessageSend}
      >
        <Stack
          flex={1}
          spacing={1}
          border='1px solid green'
          overflow='scroll'
          className='hide-scrollbar'
          ref={chatBoxRef}
        >
          {combinedMessages.map((m) => (
            <Box key={m.identifier} border='1px solid blue' minHeight={40}>
              {m.user} : {m.message}
            </Box>
          ))}
        </Stack>
        <TextInput
          value={message.get}
          onChange={message.onTextChange}
          size='small'
        />
        <Button type='submit' sx={{ display: 'none', visibility: 'hidden' }} />
      </Box>
    </Stack>
  );
};

MessageGroupPage.getInitialProps = getInitialPropsWrapper<{
  group: MessageGroup;
}>(
  async ({ query }) => {
    const groupId = `${query.groupId}`;
    return new Promise((res, rej) => {
      API.Messages.message
        .getItem(groupId)
        .then((r) => r.data)
        .then((group) => res({ group }))
        .catch(() => rej({ error: true, statusCode: 404 }));
    });
  },
  {
    pre: [LoginRequired],
  }
);

export default MessageGroupPage;
