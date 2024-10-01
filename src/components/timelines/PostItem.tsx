import API from '#/api';
import { Post } from '#/api/posts';
import { useObserver } from '#/hooks/useObserver';
import { usePostWrite } from '#/hooks/usePostWrite';
import { useUserProfile } from '#/hooks/useUser';
import DraftEditor from '#/PostWriter/DraftEditor';
import { formatRelativeTime } from '#/utils/formats/formatRelativeTime';
import {
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
  CircularProgress,
  Divider,
  Grid2,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { MouseEventHandler, Suspense, useEffect, useRef } from 'react';
import {
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
  useSetRecoilState,
} from 'recoil';
import { ImageViewer } from './ImageViewer';
import React from 'react';
import { useRouter } from '#/hooks/useCRouter';
import paths from '#/paths';
import { SuspendHOC } from '../SuspendHOC';
import NextLink from '../NextLink';
import { PickBoolean, useOverrideAtom } from './postActionAtoms';
import { PostItemToolbar } from './PostItemToolbar';
import { ClientOnlyHOC } from '../ClientOnlyHOC';
import { MentionComponent } from '#/PostWriter/DraftEditor/mention';

const postItemAtom = atomFamily<Post | null, number | undefined>({
  key: 'postItemAtom',
  default: (id) => null,
});

const relatedPostItemSelector = selectorFamily<Post | null, number | undefined>(
  {
    key: 'postItemSelector',
    get:
      (key) =>
      ({ get }) => {
        if (!key) return null;
        const value = get(postItemAtom(key));
        return value;
      },
    set:
      (key) =>
      ({ set }, newValue) => {
        if (!newValue) return;
        if (newValue instanceof DefaultValue) return;
        set(postItemAtom(key), newValue);
      },
  }
);

const useRelatedPostItem = (id: number | undefined) => {
  const [getter, setter] = useRecoilState(relatedPostItemSelector(id));

  useEffect(() => {
    if (!id) return;
    API.Posts.post
      .getItem(id)
      .then((r) => r.data)
      .then(setter);
  }, [id]);
  return [getter, setter] as const;
};
const useSetRelatedPostItem = (id: number) =>
  useSetRecoilState(relatedPostItemSelector(id));

const currentPostItemSelector = selectorFamily<Post | null, number>({
  key: 'currentPostItemSelector',
  get:
    (key) =>
    ({ get }) => {
      return get(postItemAtom(key));
    },
  set:
    (key) =>
    ({ set }, newValue) => {
      if (newValue instanceof DefaultValue) return;
      set(postItemAtom(key), newValue);
    },
});

export const useCurrentPostItem = (post: Post) => {
  const [currentPost, setCurrentPost] = useRecoilState(
    currentPostItemSelector(post.id)
  );
  useEffect(() => {
    if (currentPost) return;
    setCurrentPost(post);
  }, [post]);
  return [currentPost || post, setCurrentPost] as const;
};

const _PostItem: React.FC<{
  post: Post;
  disableAction?: boolean;
  disableLatestRepost?: boolean;
  disableImages?: boolean;
  disableDivider?: boolean;
  showParent?: boolean;
  showChildLine?: boolean;
  routingToDetail?: boolean;
}> = ({
  post: _post,
  disableAction = false,
  disableLatestRepost = false,
  disableImages = false,
  disableDivider = false,
  showParent = false,
  showChildLine = false,
  routingToDetail = true,
}) => {
  const router = useRouter();
  const theme = useTheme();
  const [post, setPost] = useCurrentPostItem(_post);
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
  const hasView = isChecked('has_view', view);

  const getCaller = (bool: boolean) =>
    bool ? API.Posts.post.postChildItem : API.Posts.post.deleteChildItem;
  const refetchPost = () => {
    setTimeout(
      () =>
        API.Posts.post
          .getItem(post.id)
          .then((r) => r.data)
          .then(setPost),
      100
    );
  };
  const onView = () => {
    getCaller(true)(post, 'views').then(refetchPost);
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
  const registPostItem = useSetRelatedPostItem(post.id);
  const [origin] = useRelatedPostItem(showParent ? post.origin : undefined);
  const [parent] = useRelatedPostItem(showParent ? post.parent : undefined);
  const [quote] = useRelatedPostItem(post.quote);
  useEffect(() => {
    registPostItem(post);
  }, [post.id]);

  const isLastReplyOfOrigin = showParent && post.reply_row_number_desc === 1;
  const _showOrigin = isLastReplyOfOrigin && origin;
  const _showParent =
    isLastReplyOfOrigin && parent && parent.user.id !== profile.id;
  const showRelavantPost =
    !showParent && !disableLatestRepost && Boolean(post.relavant_repost);

  const showMoreReplies =
    showParent &&
    _showOrigin &&
    !_showParent &&
    post.depth - origin?.depth >= 2;

  const smallPading = isSmall ? 1 : 2;

  const route: MouseEventHandler = (e) => {
    e.stopPropagation();
    if (routingToDetail) router.push(paths.postDetail(post.id));
  };

  return (
    <Stack onClick={route} sx={[routingToDetail ? { cursor: 'pointer' } : {}]}>
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
      {showMoreReplies && (
        <NextLink href={paths.postDetail(parent?.id || post.id)}>
          <Typography pl={smallPading + 6} color='primary'>
            더 많은 답글 보기
          </Typography>
        </NextLink>
      )}
      {showRelavantPost ? (
        <NextLink href={paths.mypage(post.relavant_repost?.username || '')}>
          <Stack direction='row' spacing={1} pl={smallPading + 2.5}>
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
              sx={{
                ':hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              {post.relavant_repost?.nickname} 님이 높이 띄움
            </Typography>
          </Stack>
        </NextLink>
      ) : (
        <></>
      )}
      <Box
        ref={target}
        display='flex'
        flexDirection='row'
        width='100%'
        px={smallPading}
      >
        <Box
          mt={1.5}
          mr={1}
          display='flex'
          flexDirection='column'
          alignItems='center'
        >
          <NextLink
            href={paths.mypage(profile.username)}
            onClick={(e) => e.stopPropagation()}
          >
            <Avatar src={profile.profile_image?.url} />
          </NextLink>
          {showChildLine ? (
            <Box
              onClick={route}
              flex={1}
              height='100%'
              mt={1}
              sx={{
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: theme.palette.text.disabled,
              }}
            />
          ) : (
            <></>
          )}
        </Box>
        <Stack flex={1} width='100%' onClick={route}>
          <NextLink
            onClick={(e) => e.stopPropagation()}
            href={paths.mypage(profile.username)}
          >
            <Stack direction='row' spacing={1} alignItems='center'>
              <Typography
                fontWeight='bold'
                variant='h6'
                color='textSecondary'
                sx={(theme) => ({
                  ':hover': {
                    textDecorationLine: 'underline',
                    color: theme.palette.text.primary,
                  },
                })}
              >
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
          </NextLink>
          {!_showParent && parent ? (
            <Stack direction='row' spacing={1} alignItems='center'>
              <MentionComponent mention={parent.user} className='' />
              <Typography
                display='flex'
                alignItems='center'
                variant='caption'
                color='textSecondary'
              >
                님에게 보내는 답글
              </Typography>
            </Stack>
          ) : (
            <></>
          )}
          <DraftEditor
            readOnly={true}
            blocks={post.blocks}
            quote={quote || undefined}
          />
          {disableImages ? <></> : <ImageViewer post={post} />}
          {disableAction ? (
            <></>
          ) : (
            <PostItemToolbar post={post} setPost={setPost} user={user} />
          )}
        </Stack>
      </Box>
      {disableDivider ? <></> : <Divider />}
    </Stack>
  );
};

export const PostItem = _PostItem;
