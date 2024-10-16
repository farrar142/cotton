import API from '#/api';
import { User } from '#/api/users/types';
import useUser from '#/hooks/useUser';
import useValue from '#/hooks/useValue';
import { borderGlowing } from '#/styles';
import { Box, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { SimpleProfileItem } from '../users/SimpleProfileComponent';
import NextLink from '#/components/NextLink';

const TagRecommend: React.FC = () => {
  const recommended = useValue<{ key: string; doc_count: number }[]>([]);
  useEffect(() => {
    API.Posts.post
      .getRecommendedTag()
      .then((r) => r.data)
      .then(recommended.set);
  }, []);
  return (
    <Stack
      sx={borderGlowing}
      p={1}
      borderRadius={5}
      spacing={1}
      maxWidth='100%'
    >
      <Typography pl={1}>Recommend</Typography>
      <Stack spacing={1} pl={1}>
        {recommended.get.map((u) => (
          <NextLink
            href={{
              pathname: '/search',
              query: { search: u.key.substring(1, u.key.length) },
            }}
          >
            <Stack key={u.key}>
              <Typography color='textPrimary' fontWeight='bold'>
                {u.key}
              </Typography>
              <Typography color='textDisabled' variant='caption'>
                {u.doc_count} posts
              </Typography>
            </Stack>
          </NextLink>
        ))}
      </Stack>
    </Stack>
  );
};

const UserRecommend: React.FC = () => {
  const [user] = useUser();
  const recommended = useValue<User[]>([]);
  useEffect(() => {
    if (!user) return;
    API.Relations.getRecommendedUser()
      .then((r) => r.data.results)
      .then(recommended.set);
  }, [user]);
  if (!user) return <></>;
  return (
    <Stack
      sx={borderGlowing}
      p={1}
      borderRadius={5}
      spacing={1}
      maxWidth='100%'
    >
      <Typography pl={1}>Recommend User</Typography>
      <Stack spacing={1}>
        {recommended.get.map((u) => (
          <SimpleProfileItem key={u.id} profile={u} />
        ))}
      </Stack>
    </Stack>
  );
};

export const RightSidebar: React.FC = () => {
  return (
    <Stack spacing={2} p={1}>
      <TagRecommend />
      <UserRecommend />
    </Stack>
  );
};
