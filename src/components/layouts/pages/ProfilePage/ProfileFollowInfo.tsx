import { User } from '#/api/users/types';
import NextLink from '#/components/NextLink';
import paths from '#/paths';
import { Stack, Typography } from '@mui/material';

export const ProfileFollowInfo: React.FC<{ profile: User }> = ({ profile }) => {
  return (
    <Stack direction='row' spacing={2}>
      <NextLink href={paths.userfollowings(profile.username)} $>
        <Typography
          variant='subtitle2'
          fontWeight={700}
          color='textPrimary'
          component='span'
        >
          {profile.followings_count}{' '}
        </Typography>
        <Typography
          variant='subtitle2'
          fontWeight={100}
          color='textDisabled'
          component='span'
        >
          팔로우 중
        </Typography>
      </NextLink>
      <NextLink href={paths.userfollowers(profile.username)} $>
        <Typography
          variant='subtitle2'
          fontWeight={700}
          color='textPrimary'
          component='span'
        >
          {profile.followers_count}{' '}
        </Typography>
        <Typography
          variant='subtitle2'
          fontWeight={100}
          color='textDisabled'
          component='span'
        >
          팔로워
        </Typography>
      </NextLink>
    </Stack>
  );
};
