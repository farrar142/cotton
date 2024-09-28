import API from '#/api';
import { Post } from '#/api/posts';
import useUser from '#/hooks/useUser';
import DraftEditor from '#/PostWriter/DraftEditor';
import { formatRelativeTime } from '#/utils/formats/formatRelativeTime';
import {
  BarChart,
  BarChartOutlined,
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
  Divider,
  Grid2,
  IconButton,
  Stack,
  styled,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { useEffect, useRef } from 'react';
import { atomFamily, useRecoilState } from 'recoil';
import { ImageViewer } from './ImageViewer';
import { useObserver } from '#/hooks/useObserver';
import { usePostWrite } from '#/hooks/usePostWrite';
import { IntersectingOnly } from '../utils/IntersectingOnly';

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

export const PostItem: React.FC<{
  post: Post;
  disableAction?: boolean;
  disableLatestRepost?: boolean;
  disableImages?: boolean;
  disableDivider?: boolean;
}> = ({
  post,
  disableAction = false,
  disableLatestRepost = false,
  disableImages = false,
  disableDivider = false,
}) => {
  const theme = useTheme();
  const [user, setUser] = useUser();

  const [isWrite, setIsWrite] = usePostWrite();
  const [favorite, setFavorite] = useOverrideAtom('favorite');
  const [bookmark, setBookmark] = useOverrideAtom('bookmark');
  const [repost, setRepost] = useOverrideAtom('repost');
  const [view, setView] = useOverrideAtom('view');

  // 부가기능
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
  const onView = () => {
    getCaller(true)(post, 'views');
    setView((p) => new Map(p.entries()).set(post.id, true));
  };

  //조회수 기능
  const observer = useObserver();
  const target = useRef<HTMLElement>();

  useEffect(() => {
    if (!user) return;
    if (!target.current) return;
    const t = target.current;
    if (hasView) return;
    if (hasView === undefined) return;
    observer.onIntersection(onView);
    observer.observe(t);
    return () => observer.unobserve(t);
  }, [hasView, user]);

  return (
    <IntersectingOnly sx={{ minHeight: '50px' }}>
      <Stack>
        {disableLatestRepost ||
          (post.relavant_repost && (
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
          ))}
        <Box
          ref={target}
          display='flex'
          flexDirection='row'
          width='100%'
          px={2}
        >
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
            {disableImages || <ImageViewer post={post} />}
            {disableAction || (
              <Grid2
                container
                width='100%'
                sx={{
                  color: theme.palette.text.disabled,
                }}
              >
                <Grid2 size={2}>
                  <Stack direction='row' alignItems='center'>
                    <Tooltip title='reply'>
                      <IconButton
                        color='inherit'
                        onClick={() => setIsWrite({ open: true, parent: post })}
                      >
                        <ModeCommentOutlined />
                      </IconButton>
                    </Tooltip>
                    <Typography variant='caption'>
                      {post.replies_count}
                    </Typography>
                  </Stack>
                </Grid2>
                <Grid2 size={2}>
                  <Tooltip title='cottoning'>
                    {hasRepost ? (
                      <IconButton
                        onClick={onRepost(false)}
                        disabled={!Boolean(user)}
                        color='info'
                      >
                        <Cloud />
                      </IconButton>
                    ) : (
                      <IconButton
                        onClick={onRepost(true)}
                        disabled={!Boolean(user)}
                        color='inherit'
                      >
                        <CloudOutlined />
                      </IconButton>
                    )}
                  </Tooltip>
                </Grid2>
                <Grid2 size={2}>
                  <Stack direction='row' alignItems='center'>
                    <Tooltip title='favorite'>
                      {hasFavorite ? (
                        <IconButton
                          onClick={onFavorite(false)}
                          disabled={!Boolean(user)}
                          color='error'
                        >
                          <Favorite />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={onFavorite(true)}
                          disabled={!Boolean(user)}
                          color='inherit'
                        >
                          <FavoriteBorderOutlined />
                        </IconButton>
                      )}
                    </Tooltip>
                    <Typography variant='caption'>
                      {post.favorites_count}
                    </Typography>
                  </Stack>
                </Grid2>
                <Grid2 size={2}>
                  <Tooltip title='bookmark'>
                    {hasBookmark ? (
                      <IconButton
                        onClick={onBookmark(false)}
                        disabled={!Boolean(user)}
                        color='warning'
                      >
                        <Bookmark />
                      </IconButton>
                    ) : (
                      <IconButton
                        onClick={onBookmark(true)}
                        disabled={!Boolean(user)}
                        color='inherit'
                      >
                        <BookmarkBorderOutlined />
                      </IconButton>
                    )}
                  </Tooltip>
                </Grid2>
                <Grid2 size={3}>
                  <Stack direction='row' alignItems='center'>
                    <Tooltip title='views'>
                      <IconButton color='inherit'>
                        <BarChartOutlined />
                      </IconButton>
                    </Tooltip>
                    <Typography variant='caption'>
                      {post.views_count}
                    </Typography>
                  </Stack>
                </Grid2>
              </Grid2>
            )}
          </Stack>
        </Box>
        {disableDivider || <Divider />}
      </Stack>
    </IntersectingOnly>
  );
};
