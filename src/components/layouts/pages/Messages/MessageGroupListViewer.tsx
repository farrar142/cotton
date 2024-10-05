import API from '#/api';
import { MessageGroup } from '#/api/chats';
import { User } from '#/api/users/types';
import TextInput from '#/components/inputs/TextInput';
import NextLink from '#/components/NextLink';
import { useTimelinePagination } from '#/components/timelines/usePostPagination';
import { useKeyScrollPosition } from '#/hooks/useKeepScrollPosition';
import { useUserProfile } from '#/hooks/useUser';
import useValue from '#/hooks/useValue';
import paths from '#/paths';
import { glassmorphism } from '#/styles';
import { formatDateBasedOnYear } from '#/utils/formats/formatDateBasedOnYear';
import { Search } from '@mui/icons-material';
import { Avatar, Box, InputAdornment, Stack, Typography } from '@mui/material';
import moment from 'moment';
import React, { useEffect, useMemo } from 'react';
import {
  MessageGroupWithInCommingMessages,
  useMessageGroupItem,
  useMessageGroupList,
} from './MessageGroupAtom';

const DirectMessageSimpleViewer: React.FC<{
  group: MessageGroupWithInCommingMessages;
  me: User;
  isSelected: boolean;
}> = ({ group, me, isSelected }) => {
  const otherUser = useMemo(
    () => group.attendants.filter((user) => user.id !== me.id)[0],
    [group]
  );
  const lastMessageDate = useMemo(() => {
    if (group.inComingMessages.length !== 0) {
      return formatDateBasedOnYear(
        group.inComingMessages[group.inComingMessages.length - 1].created_at
      );
    }
    return (
      group.latest_message &&
      formatDateBasedOnYear(group.latest_message_created_at)
    );
  }, [group.latest_message, group.inComingMessages]);
  const lastMessage = useMemo(() => {
    if (group.inComingMessages.length !== 0) {
      return group.inComingMessages[group.inComingMessages.length - 1].message;
    }
    return group.latest_message;
  }, [group.latest_message, group.inComingMessages]);
  return (
    <NextLink
      href={paths.groupMessage(group.id)}
      bgcolor={(theme) => (isSelected ? theme.palette.action.hover : undefined)}
    >
      <Stack
        direction='row'
        spacing={1}
        p={1}
        alignItems='center'
        sx={(theme) => ({
          ':hover': {
            bgcolor: theme.palette.action.hover,
          },
        })}
      >
        <Avatar
          src={otherUser.profile_image?.small || otherUser.profile_image?.url}
        />
        <Stack>
          <Stack direction='row' spacing={1} alignItems='center'>
            <Typography fontWeight='bold' variant='h6' color='textPrimary'>
              {otherUser.nickname}
            </Typography>
            {lastMessageDate && (
              <>
                <Typography color='textPrimary'>·</Typography>
                <Typography
                  component='span'
                  variant='subtitle2'
                  color='textDisabled'
                >
                  {lastMessageDate}
                </Typography>
              </>
            )}
          </Stack>
          <Typography color='textDisabled'>
            <Typography component='span'>{lastMessage}</Typography>
          </Typography>
        </Stack>
      </Stack>
    </NextLink>
  );
};

const MessageGroupItem: React.FC<{
  group: MessageGroup;
  me: User;
  isSelected: boolean;
}> = ({ group, me, isSelected }) => {
  const atomGroup = useMessageGroupItem(group, me);
  // if (!group.latest_message) return <></>;
  if (group.is_direct_message)
    return (
      <DirectMessageSimpleViewer
        group={atomGroup.group}
        me={me}
        isSelected={isSelected}
      />
    );
  return <></>;
};

export const MessageGroupListViewer: React.FC<{
  me: User;
  currentGroup?: MessageGroup;
}> = ({ me, currentGroup }) => {
  const [profile] = useUserProfile(me);
  const search = useValue('');
  const pagination = useTimelinePagination({
    func: API.Messages.message.getItems,
    apiKey: `${profile.username}:message_groups`,
    disablePrevfetch: true,
  });
  const [__, setScroll] = useKeyScrollPosition();
  const { groupList, handleGroupList } = useMessageGroupList(me);
  // useEffect(() => {
  //   if (pagination.newData.length === 0) return;
  //   pagination.mergeDatas();
  // }, [pagination.newData]);

  useEffect(() => {
    handleGroupList(pagination.data);
  }, [pagination.data]);

  const sortedGroupList = useMemo(() => {
    const getSortKey = (group: MessageGroupWithInCommingMessages) => {
      if (group.inComingMessages.length !== 0)
        return group.inComingMessages[group.inComingMessages.length - 1]
          .created_at;
      return (
        group.latest_message_created_at || new Date('1970-01-01').toISOString()
      );
    };
    return [...groupList].sort((a, b) => {
      const akey = getSortKey(a);
      const bkey = getSortKey(b);
      return moment(bkey).diff(akey);
    });
  }, [groupList]);

  return (
    <Box maxWidth='100%'>
      <Box
        position='sticky'
        top={0}
        p={1}
        sx={(theme) => ({
          ...glassmorphism(theme),
          zIndex: 10,
          cursor: 'pointer',
          ':hover': { bgcolor: theme.palette.action.hover },
        })}
        onClick={() => setScroll({ key: 'page:messages', value: 0 })}
      >
        <Typography variant='h5'>Messages</Typography>
      </Box>
      <Box p={1}>
        <TextInput
          fullWidth
          label='Search Messages'
          name='message-search'
          value={search.get}
          onChange={search.onTextChange}
          size='small'
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position='start'>
                  <Search />
                </InputAdornment>
              ),
              sx: { borderRadius: 5 },
            },
          }}
        />
      </Box>
      <Stack spacing={2}>
        {sortedGroupList.map((group) => {
          const isSelected = group.id == currentGroup?.id;
          return (
            <MessageGroupItem
              key={group.id}
              group={group}
              me={profile}
              isSelected={isSelected}
            />
          );
        })}
      </Stack>
    </Box>
  );
};
