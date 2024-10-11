import API from '#/api';
import { User } from '#/api/users/types';
import CommonLayout from '#/components/layouts/CommonLayout';
import { CommonTab } from '#/components/layouts/CommonTab';
import { SimpleProfileItem } from '#/components/SimpleProfileComponent';
import getInitialPropsWrapper from '#/functions/getInitialPropsWrapper';
import { useCursorPagination } from '#/hooks/paginations/useCursorPagination';
import { useRouter } from '#/hooks/useCRouter';
import { useObserver } from '#/hooks/useObserver';
import paths from '#/paths';
import { Box, Stack } from '@mui/material';
import React, { useEffect, useRef } from 'react';

const FollowersPage: ExtendedNextPage<{ profile: User }> = ({ profile }) => {
  const { data, fetchNext } = useCursorPagination({
    getter: API.Relations.getFollowers(profile.id),
    apiKey: `followers:${profile.username}`,
  });
  const observer = useObserver();
  const fetchNextBlock = useRef<HTMLElement>();
  useEffect(() => {
    const block = fetchNextBlock.current;
    if (!block) return;
    observer.observe(block);
    observer.onIntersection(fetchNext);
    return () => observer.unobserve(block);
  }, [data]);

  return (
    <Stack spacing={1}>
      {data.map((profile) => (
        <SimpleProfileItem profile={profile} key={profile.id} />
      ))}
      <Box ref={fetchNextBlock} />
    </Stack>
  );
};

FollowersPage.getLayout = ({ children, props }) => {
  const router = useRouter();
  return (
    <CommonLayout>
      <Box>
        <CommonTab
          defaultTabIndex={1}
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
          panels={[<></>, <>{children}</>]}
          pannelProps={{ sx: { p: 0 } }}
        />
      </Box>
    </CommonLayout>
  );
};

//@ts-ignore
FollowersPage.getInitialProps = getInitialPropsWrapper(async ({ query }) => {
  const username = `${query.username}`;
  return API.Relations.getUserByUsername(username)
    .then((r) => r.data)
    .then((profile) => ({ profile }))
    .catch(() => ({ error: true, status: 404 }));
});
export default FollowersPage;
