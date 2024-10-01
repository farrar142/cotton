import API from '#/api';
import { User } from '#/api/users/types';
import CommonLayout from '#/components/layouts/CommonLayout';
import { CommonTab } from '#/components/layouts/CommonTab';
import getInitialPropsWrapper from '#/functions/getInitialPropsWrapper';
import { useRouter } from '#/hooks/useCRouter';
import useValue from '#/hooks/useValue';
import paths from '#/paths';
import { Box } from '@mui/material';
import React from 'react';

const FollowingsPage: ExtendedNextPage<{ profile: User }> = () => {
  return <>aaaa</>;
};

FollowingsPage.getLayout = ({ children, props }) => {
  const router = useRouter();
  console.log(props);
  return (
    <CommonLayout>
      <Box>
        <CommonTab
          labels={[
            {
              label: 'Followings',
              value: 'Followings',
              onClick: (e) => {
                e.preventDefault();
                router.push(paths.userfollowings(props.profile.username));
              },
            },
            {
              label: 'Followers',
              value: 'Followers',
              onClick: (e) => {
                e.preventDefault();
                router.push(paths.userfollowers(props.profile.username));
              },
            },
          ]}
          panels={[<>{children}</>, <></>]}
        />
      </Box>
    </CommonLayout>
  );
};

//@ts-ignore
FollowingsPage.getInitialProps = getInitialPropsWrapper(async ({ query }) => {
  const username = `${query.username}`;
  return API.Relations.getUserByUsername(username)
    .then((r) => r.data)
    .then((profile) => ({ profile }))
    .catch(() => ({ error: true, status: 404 }));
});

export default FollowingsPage;
