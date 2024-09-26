import { Paginated } from '#/api/general';
import { Post } from '#/api/posts';
import useValue from '#/hooks/useValue';
import DraftEditor from '#/PostWriter/DraftEditor';
import { formatRelativeTime } from '#/utils/formatRelativeTime';
import {
  BookmarkBorderOutlined,
  CloudOutlined,
  FavoriteBorderOutlined,
  ModeCommentOutlined,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Grid2,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { AxiosResponse } from 'axios';
import { useEffect } from 'react';
import { atomFamily, useRecoilState } from 'recoil';

const boolOverridedAtom = atomFamily({
  key: 'boolOverridedAtom',
  default: (field: string) => new Map<number, boolean>(),
});

const useOverrideAtom = (field: string) => {
  return useRecoilState(boolOverridedAtom(field));
};

const PostItem: React.FC<{ post: Post }> = ({ post }) => {
  const [favorite, setFavorite] = useOverrideAtom('favorite');
  const [bookmark, setBookmark] = useOverrideAtom('bookmark');
  const [repost, setRepost] = useOverrideAtom('repost');
  return (
    <Box display='flex' flexDirection='row' width='100%'>
      <Box minWidth={25} mt={1.5} mr={1}>
        <Avatar />
      </Box>
      <Stack flex={1} width='100%'>
        <Stack direction='row' spacing={1} alignItems='center'>
          <Typography fontWeight='bold' variant='h6'>
            {post.user.nickname}
          </Typography>
          <Typography
            variant='caption'
            sx={(theme) => ({ color: theme.palette.text.secondary })}
          >
            @{post.user.username}
          </Typography>
          <Typography>·</Typography>
          <Typography
            variant='caption'
            sx={(theme) => ({ color: theme.palette.text.secondary })}
          >
            {formatRelativeTime(post.created_at)}
          </Typography>
        </Stack>
        <DraftEditor onPost={() => {}} readOnly={true} blocks={post.blocks} />
        <Grid2 container width='100%'>
          <Grid2 size={3}>
            <Tooltip title='reply'>
              <IconButton>
                <ModeCommentOutlined />
              </IconButton>
            </Tooltip>
          </Grid2>
          <Grid2 size={3}>
            <Tooltip title='cottoning'>
              <IconButton>
                <CloudOutlined />
              </IconButton>
            </Tooltip>
          </Grid2>
          <Grid2 size={3}>
            <Tooltip title='favorite'>
              <IconButton>
                <FavoriteBorderOutlined />
              </IconButton>
            </Tooltip>
          </Grid2>
          <Grid2 size={3}>
            <Tooltip title='bookmark'>
              <IconButton>
                <BookmarkBorderOutlined />
              </IconButton>
            </Tooltip>
          </Grid2>
        </Grid2>
      </Stack>
    </Box>
  );
};

export const PostTimeline: React.FC<{
  getter: (
    params?: {},
    options?: { page: number | string }
  ) => Promise<AxiosResponse<Paginated<Post>>>;
}> = ({ getter }) => {
  const items = useValue<Post[]>([]);
  useEffect(() => {
    getter()
      .then(({ data }) => data.results)
      .then(items.set);
  }, []);
  return (
    <Stack spacing={1}>
      {items.get.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </Stack>
  );
};
