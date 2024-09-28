import API from '#/api';
import { User } from '#/api/users/types';
import {
  ProfileHeader,
  ProfileInfo,
  ProfileTab,
} from '#/components/layouts/pages/ProfilePage';
import { PostTimeline } from '#/components/timelines';
import getInitialPropsWrapper from '#/functions/getInitialPropsWrapper';
import { useRouter } from '#/hooks/useCRouter';
import useValue from '#/hooks/useValue';
import { Box, useTheme } from '@mui/material';

const ProfilePage: ExtendedNextPage<{ profile: User; postCount: number }> = ({
  profile,
  postCount,
}) => {
  if (!profile.is_registered) return <></>;

  return (
    <Box
      sx={{
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'divider',
        pb: 10,
      }}
    >
      <ProfileHeader profile={profile} postCount={postCount} />
      <ProfileInfo profile={profile} />
      <ProfileTab profile={profile} />
    </Box>
  );
};
ProfilePage.getInitialProps = getInitialPropsWrapper(async ({ query }) => {
  return new Promise((res, rej) => {
    const username = `${query.username}`;

    const postCount = API.Posts.post
      .getCount({ username })
      .then(({ data }) => data.count);
    const profile = API.Relations.getUserByUsername(username)
      .then(({ data }) => data)
      //@ts-ignore
      .catch(() => res({ error: true, statusCode: 404 }));

    Promise.all([profile, postCount]).then(([profile, postCount]) => {
      if (!profile) {
        //@ts-ignore
        res({ error: true, statusCode: 404 });
      } else {
        res({ profile, postCount });
      }
    });
  });
});
export default ProfilePage;
