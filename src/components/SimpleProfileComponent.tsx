import { User } from '#/api/users/types';
import { Person } from '@mui/icons-material';
import {
  Box,
  Stack,
  Avatar,
  Typography,
  Button,
  SxProps,
  Theme,
  styled,
} from '@mui/material';
import { SystemStyleObject } from '@mui/system/styleFunctionSx';
import { MouseEventHandler, ReactNode, useMemo } from 'react';
import NextLink from './NextLink';
import paths from '#/paths';
import API from '#/api';
import { usePromiseState } from '#/hooks/usePromiseState';
import { useUserProfile } from '#/hooks/useUser';
import React from 'react';

export const SimpleProfileItem: React.FC<{
  profile: User;
  onClick?: MouseEventHandler;
  isFocused?: boolean;
  containerStyle?: (theme: Theme) => SystemStyleObject<Theme>;
}> = ({ profile: _profile, onClick, isFocused, containerStyle }) => {
  const [profile, user, { isMyProfile, setProfile, setMyProfile }] =
    useUserProfile(_profile);
  const { done, wrapper } = usePromiseState();
  const followUser: MouseEventHandler = (e) => {
    e.stopPropagation();
    return (() => {
      if (profile.is_following_to) {
        return API.Relations.unfollowUser(profile.id);
      } else {
        return API.Relations.followUser(profile.id);
      }
    })().then(({ data }) => {
      API.Users.me()
        .then((r) => r.data)
        .then(setMyProfile);
      return API.Relations.getUserByUsername(profile.username)
        .then((r) => r.data)
        .then(setProfile);
    });
  };
  const Link = useMemo(() => {
    if (onClick) {
      const Wrapper: React.FC<{
        children: ReactNode;
        href: string;
        flex?: number;
      }> = ({ children, flex }) => {
        return <Box flex={flex}>{children}</Box>;
      };
      return Wrapper;
    }
    return NextLink;
  }, [Boolean(onClick)]);
  return (
    <Box
      display='relative'
      sx={[
        (theme) => (containerStyle ? containerStyle(theme) : {}),
        (theme) => ({
          cursor: 'pointer',
          ':hover': {
            bgcolor: theme.palette.action.hover,
          },
          bgcolor: isFocused ? theme.palette.action.focus : undefined,
        }),
      ]}
    >
      <Stack
        key={profile.id}
        direction='row'
        spacing={1}
        onClick={onClick}
        sx={{
          p: 1,
        }}
        width='100%'
      >
        <Link href={paths.mypage(profile.username)}>
          <Box display='flex' alignItems='center' justifyContent='center'>
            <Avatar
              src={profile.profile_image?.medium || profile.profile_image?.url}
            />
          </Box>
        </Link>
        <Link href={paths.mypage(profile.username)} flex={1}>
          <Stack spacing={-0.5}>
            <Typography color='textPrimary'>{profile.nickname}</Typography>
            <Typography color='textDisabled'>@{profile.username}</Typography>
            {profile.is_mutual_follow && (
              <Typography
                color='text.disabled'
                display='flex'
                alignItems='center'
              >
                <Person fontSize='small' />
                나와 서로 팔로우하고 있습니다.
              </Typography>
            )}
          </Stack>
        </Link>
        {!isMyProfile && (
          <Box display='flex' alignItems='center'>
            <Button
              variant='outlined'
              color={profile.is_following_to ? 'info' : 'inherit'}
              sx={{ borderRadius: 15, zIndex: 3 }}
              disabled={done.get === false}
              onClick={wrapper(followUser)}
            >
              {profile.is_following_to ? '언팔로우' : '팔로우'}
            </Button>
          </Box>
        )}
      </Stack>
    </Box>
  );
};
