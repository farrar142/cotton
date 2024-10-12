import API from '#/api';
import { Post } from '#/api/posts';
import { User } from '#/api/users/types';
import {
  useCurrentPostData,
  usePostData,
  useSetPostData,
} from '#/hooks/posts/usePostData';
import { useRouter } from '#/hooks/useCRouter';
import { useObserver } from '#/hooks/useObserver';
import useUser, { useUserProfile } from '#/hooks/useUser';
import paths from '#/paths';
import DraftEditor from '#/PostWriter/DraftEditor';
import { MentionComponent } from '#/PostWriter/DraftEditor/mention';
import { formatRelativeTime } from '#/utils/formats/formatRelativeTime';
import { Cloud, Delete, MoreVert, Settings } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { ProfilePopper } from '../layouts/pages/ProfilePage/ProfilePopper';
import NextLink from '../NextLink';
import { ImageViewer } from './ImageViewer';
import { PickBoolean, useOverrideAtom } from './postActionAtoms';
import { PostItemToolbar } from './PostItemToolbar';
import useValue from '#/hooks/useValue';
import moment from 'moment';

const _PostItem: React.FC<{
  post: Post;
  disableAction?: boolean;
  disableLatestRepost?: boolean;
  disableImages?: boolean;
  disableDivider?: boolean;
  showParent?: boolean;
  showChildLine?: boolean;
  routingToDetail?: boolean;
  showQuote?: boolean;
  isDetailView?: boolean;
}> = ({
  post: _post,
  disableAction = false,
  disableLatestRepost = false,
  disableImages = false,
  disableDivider = false,
  showParent = false,
  showChildLine = false,
  showQuote = true,
  routingToDetail = true,
  isDetailView = false,
}) => {
  const router = useRouter();
  const theme = useTheme();
  const [post, setPost] = useCurrentPostData(_post);
  const [profile, user] = useUserProfile(post.user);
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

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
  const registPostItem = useSetPostData(post.id);
  const [origin] = usePostData(showParent ? post.origin : undefined);
  const [parent] = usePostData(showParent ? post.parent : undefined);
  const [quote] = usePostData(post.quote);
  useEffect(() => {
    registPostItem(post);
  }, [post.id]);

  const isLastReplyOfOrigin = showParent && post.reply_row_number_desc === 1;
  const isParentOriginSame =
    Boolean(origin && parent) && origin?.id !== parent?.id;
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

  const haveToRoute = useRef(false);
  const route: MouseEventHandler = (e) => {
    console.log('route');
    e.stopPropagation();
    if (haveToRoute.current) return;
    if (routingToDetail) router.push(paths.postDetail(post.id));
  };
  if (post.deleted_at)
    return (
      <Stack px={1} spacing={1.5}>
        <Typography>User deleted this post</Typography>
        {disableDivider ? <></> : <Divider />}
      </Stack>
    );
  // if (routingToDetail)
  //   return (
  //   );
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
      {_showParent && isParentOriginSame ? (
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
            Show More Replies
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
              {post.relavant_repost?.nickname} Cottened
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
          {!isDetailView && (
            <NextLink
              href={paths.mypage(profile.username)}
              onClick={(e) => e.stopPropagation()}
            >
              <Avatar src={profile.profile_image?.url} />
            </NextLink>
          )}
          {!isDetailView && showChildLine ? (
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
        <Stack flex={1}>
          {isDetailView ? (
            <PostDetailHeader post={post} profile={profile} />
          ) : (
            <PostHeader post={post} profile={profile} />
          )}
          {!_showParent && parent ? (
            <Stack direction='row' spacing={1} alignItems='center'>
              <Typography
                display='flex'
                alignItems='center'
                variant='caption'
                color='textSecondary'
              >
                reply to
              </Typography>
              <MentionComponent mention={parent.user} className='' />
            </Stack>
          ) : (
            <></>
          )}
          <NextLink
            draggable={false}
            sx={{ color: 'inherit' }}
            href={paths.postDetail(post.id)}
            disabled={!Boolean(routingToDetail)}
          >
            <DraftEditor
              readOnly={true}
              blocks={post.blocks}
              quote={(showQuote && quote) || undefined}
            />
          </NextLink>
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

const PostHeader: React.FC<{
  post: Post;
  profile: User;
  onDelete?: () => void;
}> = ({ post, profile, onDelete }) => {
  const formattedTime = useValue(formatRelativeTime(post.created_at));

  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = formatRelativeTime(post.created_at);
      if (newTime !== formattedTime.get) {
        formattedTime.set(newTime);
      }
    });
    return () => clearInterval(interval);
  }, []);
  return (
    <Stack direction='row' alignItems='center'>
      <NextLink
        onClick={(e) => e.stopPropagation()}
        href={paths.mypage(profile.username)}
      >
        <Stack direction='row' spacing={1} alignItems='center'>
          <ProfilePopper profileId={profile.id}>
            <Typography
              fontWeight='bold'
              variant='h6'
              color='textPrimary'
              sx={(theme) => ({
                ':hover': {
                  textDecorationLine: 'underline',
                  color: theme.palette.text.primary,
                },
              })}
            >
              {profile.nickname}
            </Typography>
          </ProfilePopper>
          <ProfilePopper profileId={profile.id}>
            <Typography
              variant='caption'
              sx={(theme) => ({ color: theme.palette.text.secondary })}
            >
              @{profile.username}
            </Typography>
          </ProfilePopper>
          <Typography color='textDisabled'>·</Typography>
          <Typography
            variant='caption'
            sx={(theme) => ({ color: theme.palette.text.secondary })}
          >
            {formattedTime.get}
          </Typography>
        </Stack>
      </NextLink>

      <Box flex={1} />
      <PostSettings post={post} profile={profile} />
    </Stack>
  );
};
const PostDetailHeader: React.FC<{
  post: Post;
  profile: User;
  onDelete?: () => void;
}> = ({ post, profile, onDelete }) => {
  return (
    <Stack
      direction='row'
      alignItems='center'
      position='relative'
      spacing={1}
      left={-8}
      pb={1}
    >
      <NextLink
        onClick={(e) => e.stopPropagation()}
        href={paths.mypage(profile.username)}
        position='relative'
      >
        <Avatar
          src={profile.profile_image?.small || profile?.profile_image?.url}
        />
      </NextLink>
      <NextLink
        onClick={(e) => e.stopPropagation()}
        href={paths.mypage(profile.username)}
        position='relative'
      >
        <Stack>
          <ProfilePopper profileId={profile.id}>
            <Typography
              fontWeight='bold'
              variant='h6'
              lineHeight={1.4}
              color='textPrimary'
              sx={(theme) => ({
                ':hover': {
                  textDecorationLine: 'underline',
                  color: theme.palette.text.primary,
                },
              })}
            >
              {profile.nickname}
            </Typography>
          </ProfilePopper>
          <ProfilePopper profileId={profile.id}>
            <Typography
              variant='caption'
              sx={(theme) => ({ color: theme.palette.text.secondary })}
            >
              @{profile.username}
            </Typography>
          </ProfilePopper>
        </Stack>
      </NextLink>
      <Box flex={1} />
      <PostSettings post={post} profile={profile} />
    </Stack>
  );
};

const PostSettings: React.FC<{ post: Post; profile: User }> = ({
  post,
  profile,
}) => {
  const [, setPost] = usePostData(post.id);
  const [user] = useUser();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const isMyPost = Boolean(user && user.id === profile.id);
  const onDelete = isMyPost
    ? () => {
        API.Posts.post
          .deleteItem(post.id)
          .then(() => {
            setPost((p) => ({ ...post, deleted_at: moment().toISOString() }));
          })
          .then(() => {
            handleClose();
          });
      }
    : undefined;
  if (!isMyPost) return;
  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVert />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {onDelete && (
          <MenuItem onClick={onDelete}>
            <ListItemIcon>
              <Delete />
            </ListItemIcon>
            Delete
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export const PostItem = _PostItem;
