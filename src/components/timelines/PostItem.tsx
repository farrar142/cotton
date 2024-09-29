import API from '#/api';
import { Post } from '#/api/posts';
import useUser, { useUserProfile } from '#/hooks/useUser';
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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useEffect, useRef } from 'react';
import {
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
  useSetRecoilState,
} from 'recoil';
import { ImageViewer } from './ImageViewer';
import { useObserver } from '#/hooks/useObserver';
import { usePostWrite } from '#/hooks/usePostWrite';
import { IntersectingOnly } from '../utils/IntersectingOnly';
import useValue from '#/hooks/useValue';

const postItemAtom = atomFamily<Post | null, number | undefined>({
  key: 'postItemAtom',
  default: (id) => null,
});

const postItemSelector = selectorFamily<Post | null, number | undefined>({
  key: 'postItemSelector',
  get:
    (key) =>
    ({ get }) => {
      if (!key) return null;
      const value = get(postItemAtom(key));
      if (value) return value;
      return API.Posts.post.getItem(key).then((r) => r.data);
    },
  set:
    (key) =>
    ({ set }, newValue) => {
      if (!newValue) return;
      if (newValue instanceof DefaultValue) return;
      set(postItemAtom(key), newValue);
    },
});

const usePostItem = (id: number | undefined) =>
  useRecoilState(postItemSelector(id));
const useSetPostItem = (id: number) => useSetRecoilState(postItemSelector(id));

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

const _PostItem: React.FC<{
  post: Post;
  disableAction?: boolean;
  disableLatestRepost?: boolean;
  disableImages?: boolean;
  disableDivider?: boolean;
  showParent?: boolean;
  showChildLine?: boolean;
}> = ({
  post,
  disableAction = false,
  disableLatestRepost = false,
  disableImages = false,
  disableDivider = false,
  showParent = false,
  showChildLine = false,
}) => {
  const theme = useTheme();
  const [profile, user] = useUserProfile(post.user);
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

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
    if (post[field]) return true;
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

  //부모 기능
  const registPostItem = useSetPostItem(post.id);
  const [origin] = usePostItem(showParent ? post.origin : undefined);
  const [parent] = usePostItem(showParent ? post.parent : undefined);

  useEffect(() => {
    registPostItem(post);
  }, [post.id]);

  const isLastReplyOfOrigin = showParent && post.reply_row_number_desc === 1;
  const _showOrigin = isLastReplyOfOrigin && origin;
  const _showParent =
    isLastReplyOfOrigin && parent && parent.user.id !== profile.id;
  const showRelavantPost =
    !showParent && !disableLatestRepost && Boolean(post.relavant_repost);
  return (
    <Stack>
      {_showOrigin ? (
        <_PostItem
          post={origin}
          disableDivider
          disableLatestRepost
          showChildLine
        />
      ) : (
        <></>
      )}
      {_showParent ? (
        <PostItem
          post={parent}
          disableDivider
          disableLatestRepost
          showChildLine
        />
      ) : (
        <></>
      )}
      {showRelavantPost ? (
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
            {post.relavant_repost?.nickname} 님이 높이 띄움
          </Typography>
        </Stack>
      ) : (
        <></>
      )}
      <Box
        ref={target}
        display='flex'
        flexDirection='row'
        width='100%'
        px={isSmall ? 1 : 2}
      >
        <Box
          mt={1.5}
          mr={1}
          display='flex'
          flexDirection='column'
          alignItems='center'
        >
          <Avatar src={profile?.profile_image?.url} />
          {showChildLine && (
            <Box
              flex={1}
              height='100%'
              mt={1}
              sx={{
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: theme.palette.text.disabled,
              }}
            />
          )}
        </Box>
        <Stack flex={1} width='100%'>
          <Stack direction='row' spacing={1} alignItems='center'>
            <Typography fontWeight='bold' variant='h6'>
              {profile.nickname}
            </Typography>
            <Typography
              variant='caption'
              sx={(theme) => ({ color: theme.palette.text.secondary })}
            >
              @{profile.username}
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
          {disableImages ? <></> : <ImageViewer post={post} />}
          {disableAction ? (
            <></>
          ) : (
            <Box
              width='100%'
              display='flex'
              justifyContent='space-between'
              sx={{
                color: theme.palette.text.disabled,
              }}
              pr={3}
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
                  <Typography variant='caption'>{post.views_count}</Typography>
                </Stack>
              </Grid2>
            </Box>
          )}
        </Stack>
      </Box>
      {disableDivider ? <></> : <Divider />}
    </Stack>
  );
};

export const PostItem = _PostItem;
