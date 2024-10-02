import { User } from '#/api/users/types';
import { Person } from '@mui/icons-material';
import { Box, Stack, Avatar, Typography, Button } from '@mui/material';
import { MouseEventHandler } from 'react';
import NextLink from './NextLink';
import paths from '#/paths';
import API from '#/api';
import { usePromiseState } from '#/hooks/usePromiseState';
import { useUserProfile } from '#/hooks/useUser';

export const SimpleProfileItem: React.FC<{
  profile: User;
  onClick?: MouseEventHandler;
}> = ({ profile: _profile, onClick }) => {
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
  return (
    <Box display='relative'>
      <Stack
        key={profile.id}
        direction='row'
        spacing={1}
        onClick={onClick}
        sx={(theme) => ({
          cursor: 'pointer',
          p: 1,
          ':hover': {
            bgcolor: theme.palette.action.hover,
          },
        })}
        width='100%'
      >
        <NextLink href={paths.mypage(profile.username)}>
          <Box display='flex' alignItems='center' justifyContent='center'>
            <Avatar
              src={profile.profile_image?.medium || profile.profile_image?.url}
            />
          </Box>
        </NextLink>
        <NextLink href={paths.mypage(profile.username)} flex={1}>
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
        </NextLink>
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
