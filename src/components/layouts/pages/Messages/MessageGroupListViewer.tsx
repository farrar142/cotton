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
import { Add, Close, Email, EmailOutlined, Search } from '@mui/icons-material';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  Dialog,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import moment from 'moment';
import React, { useEffect, useMemo } from 'react';
import {
  MessageGroupWithInCommingMessages,
  useMessageGroupItem,
  useMessageGroupList,
} from './MessageGroupAtom';
import { UserSearchComponent } from '../../users/UserSearchComponent';
import { usePromiseState } from '#/hooks/usePromiseState';
import { useRouter } from '#/hooks/useCRouter';

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

const GroupMessageSimpleViewer: React.FC<{
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

  const renderedAttendants = useMemo(() => {
    if (group.attendants.length < 2) return group.attendants.length;
    return (
      <Box
        sx={(theme) => ({
          borderRadius: 10,
          width: 20,
          height: 20,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: theme.palette.action.disabled,
        })}
      >
        <Typography fontSize={14}>+{group.attendants.length - 1}</Typography>
      </Box>
    );
  }, [group.attendants.length]);
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
        <Badge
          badgeContent={renderedAttendants}
          overlap='circular'
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          // variant='dot'
        >
          <Avatar
            src={otherUser.profile_image?.small || otherUser.profile_image?.url}
          />
        </Badge>
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
  return (
    <GroupMessageSimpleViewer
      group={atomGroup.group}
      me={me}
      isSelected={isSelected}
    />
  );
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
  const showCreateMessageGroups = useValue(false);

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
  const plusIconSize = 15;
  return (
    <Box maxWidth='100%'>
      <Box
        position='sticky'
        display='flex'
        top={0}
        p={1}
        sx={(theme) => ({
          ...glassmorphism(theme),
          zIndex: 10,
        })}
      >
        <Typography
          variant='h5'
          sx={(theme) => ({
            cursor: 'pointer',
          })}
          onClick={() => setScroll({ key: 'page:messages', value: 0 })}
        >
          Messages
        </Typography>
        <Box flex={1} />
        <IconButton
          sx={{ position: 'relative' }}
          onClick={showCreateMessageGroups.wrap((p) => !p)}
        >
          <EmailOutlined />
          <Box
            sx={(theme) => ({
              borderRadius: 10,
              position: 'absolute',
              bottom: '12%',
              right: '7%',
              width: plusIconSize,
              height: plusIconSize,
              bgcolor: theme.palette.background.default,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 5,
            })}
          >
            <Add
              sx={{
                width: plusIconSize,
                height: plusIconSize,
              }}
            />
          </Box>
        </IconButton>
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
      <Stack spacing={0}>
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
      <GroupMessageAddComponent
        me={me}
        open={showCreateMessageGroups.get}
        onClose={showCreateMessageGroups.wrap((v) => false)}
      />
    </Box>
  );
};

const GroupMessageAddComponent: React.FC<{
  open: boolean;
  onClose: () => void;
  me: User;
}> = ({ open, onClose, me }) => {
  const router = useRouter();
  const search = useValue('');
  const selectedUsers = useValue<User[]>([]);
  const { done, wrapper } = usePromiseState();

  const onCreate = wrapper(() => {
    const isDirectMessage = selectedUsers.get.length === 1;

    return API.Messages.message
      .create({
        users: [
          ...selectedUsers.get.map((u) => u.id).filter((id) => id !== me.id),
          me.id,
        ],
        is_direct_message: isDirectMessage,
      })
      .then((r) => r.data)
      .then((g) => router.push(paths.groupMessage(g.id)));
  });
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={glassmorphism}
      PaperProps={{
        sx: (theme) => ({ ...glassmorphism(theme), borderRadius: 5, py: 2 }),
        variant: 'outlined',
      }}
    >
      <Stack
        width='100%'
        maxWidth={(theme) => theme.breakpoints.values.xs * 1.5}
        minHeight={(theme) => theme.breakpoints.values.sm}
      >
        <Stack direction='row' alignItems='center' px={1}>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
          <Typography variant='h6'>New Message</Typography>
          <Box flex={1} />
          <Button
            variant='contained'
            size='small'
            sx={{ mr: 1 }}
            disabled={selectedUsers.get.length === 0 || !done}
            onClick={onCreate}
          >
            Create
          </Button>
        </Stack>
        <Box px={2} pb={1}>
          <TextInput
            label='Search User'
            name='username'
            value={search.get}
            onChange={search.onTextChange}
            size='small'
            variant='standard'
            fullWidth
            slotProps={{ input: { disableUnderline: true } }}
          />
        </Box>
        <Divider />
        <Box
          display='inline-block'
          flexDirection='row'
          minHeight={48}
          alignItems='center'
          maxWidth='100%'
          pt={1}
          px={1}
        >
          {selectedUsers.get.map((user) => (
            <Chip
              key={user.id}
              label={user.nickname}
              avatar={
                <Avatar
                  src={user.profile_image?.small || user.profile_image?.url}
                />
              }
              sx={{ mb: 1, mr: 1 }}
              onDelete={() =>
                selectedUsers.set((p) => p.filter((u) => u.id !== user.id))
              }
            />
          ))}
        </Box>
        <Divider />
        <UserSearchComponent
          search={search.get}
          itemStyle={(theme) => ({ px: 1, py: 0.5 })}
          onClick={(user) => {
            selectedUsers.set((p) => {
              if (p.find((u) => u.id == user.id)) {
                return p.filter((u) => u.id !== user.id);
              }
              return [...p, user];
            });
          }}
        />
      </Stack>
    </Dialog>
  );
};
