import API from '#/api';
import { User } from '#/api/users/types';
import getInitialPropsWrapper from '#/functions/getInitialPropsWrapper';
import { Box } from '@mui/material';

const ProfilePage: ExtendedNextPage<{ profile: User }> = ({ profile }) => {
  console.log(profile);
  return <Box></Box>;
};
ProfilePage.getInitialProps = getInitialPropsWrapper(async ({ query }) => {
  return new Promise((res, rej) => {
    const username = `${query.username}`;
    API.Relations.getUserByUsername(username)
      .then(({ data }) => ({ profile: data }))
      .then(res)
      //@ts-ignore
      .catch(() => res({ error: true, statusCode: 404 }));
  });
});
export default ProfilePage;
