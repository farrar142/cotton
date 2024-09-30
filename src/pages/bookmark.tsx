import API from '#/api';
import { User } from '#/api/users/types';
import TextInput from '#/components/inputs/TextInput';
import { PostTimeline } from '#/components/timelines';
import getInitialPropsWrapper from '#/functions/getInitialPropsWrapper';
import useValue from '#/hooks/useValue';
import { Search } from '@mui/icons-material';
import { Box, InputAdornment, Stack, Typography } from '@mui/material';

const BookmarkPage: ExtendedNextPage<{ user: User }> = ({ user }) => {
  const search = useValue('');
  if (!user) return;
  const userKey = `timeline/${user?.username}/bookmarks/search?${search.get}`;
  return (
    <Stack spacing={2}>
      <Box
        width='100%'
        px={2}
        sx={{
          position: 'sticky',
          top: 0,
          backdropFilter: 'blur(5px)',
          zIndex: 2,
          pt: 1,
        }}
      >
        <Stack>
          <Typography variant='h5'>Bookmark</Typography>
          <Typography pb={2} variant='subtitle2' color='textDisabled'>
            @{user.nickname}
          </Typography>
          <TextInput
            label='Search Bookmark'
            placeholder='Search Bookmark'
            value={search.get}
            onChange={search.onTextChange}
            size='small'
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position='start'>
                    <Search />
                  </InputAdornment>
                ),
                sx: { borderRadius: 5 },
              },
            }}
          />
        </Stack>
      </Box>
      <PostTimeline
        getter={API.Posts.post.getBookmarkItems}
        type={userKey}
        params={{ search: search.get }}
        disableLatestRepost={true}
      />
    </Stack>
  );
};

//@ts-ignore
BookmarkPage.getInitialProps = getInitialPropsWrapper(async ({}, { user }) => {
  if (!user) return { error: true, statusCode: 401 };
});

export default BookmarkPage;
