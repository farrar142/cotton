import API from '#/api';
import { Paginated } from '#/api/general';
import { Post } from '#/api/posts';
import useUser from '#/hooks/useUser';
import useValue from '#/hooks/useValue';
import DraftEditor from '#/PostWriter/DraftEditor';
import { formatRelativeTime } from '#/utils/formatRelativeTime';
import {
  Bookmark,
  BookmarkBorderOutlined,
  Cloud,
  CloudOutlined,
  Favorite,
  FavoriteBorderOutlined,
  ModeCommentOutlined,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  ButtonGroup,
  Divider,
  Grid2,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { AxiosResponse } from 'axios';
import { useEffect } from 'react';
import { atomFamily, useRecoilState } from 'recoil';

type PickBoolean<T> = {
  [K in keyof T]: T[K] extends boolean ? K : never;
}[keyof T];

const boolOverridedAtom = atomFamily({
  key: 'boolOverridedAtom',
  default: (field: string) => new Map<number, boolean>(),
});

const useOverrideAtom = (field: string) => {
  return useRecoilState(boolOverridedAtom(field));
};

const PostItem: React.FC<{ post: Post }> = ({ post }) => {
  const [user, setUser] = useUser();
  const [favorite, setFavorite] = useOverrideAtom('favorite');
  const [bookmark, setBookmark] = useOverrideAtom('bookmark');
  const [repost, setRepost] = useOverrideAtom('repost');
  const [view, setView] = useOverrideAtom('view');

  const isChecked = (
    field: PickBoolean<Post>,
    target: Map<number, boolean>
  ) => {
    if (field === undefined) throw Error;
    const modified = target.get(post.id);
    if (modified === undefined) return post[field];
    return modified;
  };

  const hasRepost = isChecked('has_repost', repost);
  const hasBookmark = isChecked('has_bookmark', bookmark);
  const hasFavorite = isChecked('has_favorite', favorite);
  const hasView = isChecked('has_view', view);

  const getCaller = (bool: boolean) =>
    bool ? API.Posts.post.postChildItem : API.Posts.post.deleteChildItem;

  const onRepost = (bool: boolean) => () => {
    getCaller(bool)(post, 'reposts');
    setRepost((p) => new Map(p.entries()).set(post.id, bool));
  };
  const onBookmark = (bool: boolean) => () => {
    getCaller(bool)(post, 'bookmarks');
    setBookmark((p) => new Map(p.entries()).set(post.id, bool));
  };
  const onFavorite = (bool: boolean) => () => {
    getCaller(bool)(post, 'favorites');
    setFavorite((p) => new Map(p.entries()).set(post.id, bool));
  };

  useEffect(() => {
    if (hasView) return;
  }, [hasView]);

  return (
    <Stack>
      {post.relavant_repost && (
        <Stack direction='row' spacing={1} pl={4.5}>
          <Typography
            display='flex'
            alignItems='center'
            variant='caption'
            color='textSecondary'
          >
            <Cloud fontSize='small' />
          </Typography>
          <Typography
            display='flex'
            alignItems='center'
            variant='caption'
            color='textSecondary'
          >
            {post.relavant_repost.nickname} 님이 높이 띄움
          </Typography>
        </Stack>
      )}
      <Box display='flex' flexDirection='row' width='100%' px={2}>
        <Box mt={1.5} mr={1}>
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
          <DraftEditor readOnly={true} blocks={post.blocks} />
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
                {hasRepost ? (
                  <IconButton
                    onClick={onRepost(false)}
                    disabled={!Boolean(user)}
                  >
                    <Cloud />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={onRepost(true)}
                    disabled={!Boolean(user)}
                  >
                    <CloudOutlined />
                  </IconButton>
                )}
              </Tooltip>
            </Grid2>
            <Grid2 size={3}>
              <Tooltip title='favorite'>
                {hasFavorite ? (
                  <IconButton
                    onClick={onFavorite(false)}
                    disabled={!Boolean(user)}
                  >
                    <Favorite />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={onFavorite(true)}
                    disabled={!Boolean(user)}
                  >
                    <FavoriteBorderOutlined />
                  </IconButton>
                )}
              </Tooltip>
            </Grid2>
            <Grid2 size={3}>
              <Tooltip title='bookmark'>
                {hasBookmark ? (
                  <IconButton
                    onClick={onBookmark(false)}
                    disabled={!Boolean(user)}
                  >
                    <Bookmark />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={onBookmark(true)}
                    disabled={!Boolean(user)}
                  >
                    <BookmarkBorderOutlined />
                  </IconButton>
                )}
              </Tooltip>
            </Grid2>
          </Grid2>
        </Stack>
      </Box>
      <Divider />
    </Stack>
  );
};

const postListAtom = atomFamily<Post[], string>({
  key: 'postListAtom',
  default: (type: string) => [],
});
const usePostList = (type: string) => {
  return useRecoilState(postListAtom(type));
};
export const PostTimeline: React.FC<{
  getter: (
    params?: {},
    options?: { page: number | string }
  ) => Promise<AxiosResponse<Paginated<Post>>>;
  type: string;
}> = ({ getter, type }) => {
  const [items, setItems] = usePostList(type);
  useEffect(() => {
    if (0 < items.length) return;
    getter()
      .then(({ data }) => data.results)
      .then(setItems);
  }, []);

  return (
    <Stack spacing={1}>
      {items.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </Stack>
  );
};
