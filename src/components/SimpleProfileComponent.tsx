import { User } from '#/api/users/types';
import { Person } from '@mui/icons-material';
import { Box, Stack, Avatar, Typography } from '@mui/material';

export const SimpleProfileItem: React.FC<{
  profile: User;
  onClick: () => void;
}> = ({ profile, onClick }) => {
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
        <Box display='flex' alignItems='center' justifyContent='center'>
          <Avatar
            src={profile.profile_image?.medium || profile.profile_image?.url}
          />
        </Box>
        <Stack spacing={-0.5}>
          <Typography>{profile.nickname}</Typography>
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
      </Stack>
    </Box>
  );
};
