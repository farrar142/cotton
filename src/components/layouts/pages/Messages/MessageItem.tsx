import { User } from '#/api/users/types';
import NextLink from '#/components/NextLink';
import { useFetchedProfile } from '#/hooks/useUser';
import paths from '#/paths';
import { Stack, Box, Avatar, Typography } from '@mui/material';
import { MergedMessage } from './types';
import moment from 'moment';
import React from 'react';

export const MessgeItem: React.FC<{ messages: MergedMessage; me: User }> = ({
  messages,
  me,
}) => {
  console.log('me in item', me);
  const [user] = useFetchedProfile(messages.user);
  console.log('target user', user);
  const lastMessage = messages.messages[messages.messages.length - 1];
  const radius = 5;
  const isMyMessage = user?.id === me.id;
  return (
    <Stack direction={isMyMessage ? 'row-reverse' : 'row'} spacing={1} pb={2}>
      {isMyMessage ? (
        <></>
      ) : (
        <Box display='flex' alignItems='flex-end'>
          <NextLink href={paths.mypage(user?.username || '')}>
            <Avatar
              src={user?.profile_image?.small || user?.profile_image?.url}
            />
          </NextLink>
        </Box>
      )}
      <Stack alignItems={isMyMessage ? 'flex-end' : 'flex-start'}>
        <Stack spacing={1} alignItems={isMyMessage ? 'flex-end' : 'flex-start'}>
          {messages.messages.map((message, index) => {
            const isLastMessage = index === messages.messages.length - 1;
            return (
              <Box
                key={message.identifier}
                bgcolor={(theme) =>
                  isMyMessage
                    ? theme.palette.primary.dark
                    : theme.palette.action.hover
                }
                p={0.5}
                px={2}
                pb={0.8}
                sx={[
                  { borderRadius: radius },
                  isLastMessage
                    ? isMyMessage
                      ? { borderBottomRightRadius: 0 }
                      : { borderBottomLeftRadius: 0 }
                    : {},
                ]}
              >
                <Typography
                  sx={
                    isMyMessage
                      ? {
                          textAlign: 'end',
                        }
                      : {}
                  }
                >
                  {message.message}
                </Typography>
              </Box>
            );
          })}
        </Stack>
        <Typography variant='subtitle2' color='textDisabled'>
          {moment(lastMessage.created_at)
            .format('YYYY년 MM월 DD일 A hh:mm')
            .replace('PM', '오후')
            .replace('AM', '오전')}
        </Typography>
      </Stack>
    </Stack>
  );
};
