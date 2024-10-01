import API from '#/api';
import { Post } from '#/api/posts';
import {
  ModeCommentOutlined,
  Cloud,
  CloudOutlined,
  Favorite,
  FavoriteBorderOutlined,
  Bookmark,
  BookmarkBorderOutlined,
  BarChartOutlined,
  Create,
} from '@mui/icons-material';
import {
  Box,
  Grid2,
  Stack,
  Tooltip,
  IconButton,
  Typography,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useOverrideAtom, PickBoolean } from './postActionAtoms';
import { Dispatch, MouseEvent, MouseEventHandler, SetStateAction } from 'react';
import { usePostWrite } from '#/hooks/usePostWrite';
import { User } from '#/api/users/types';
import useValue from '#/hooks/useValue';
import { borderGlowing, glassmorphism } from '#/styles';

export const PostItemToolbar: React.FC<{
  post: Post;
  setPost: Dispatch<SetStateAction<Post | null>>;
  user: User | null;
}> = ({ post, setPost, user }) => {
  const theme = useTheme();
  const [isWrite, setIsWrite] = usePostWrite();
  const [favorite, setFavorite] = useOverrideAtom('favorite');
  const [bookmark, setBookmark] = useOverrideAtom('bookmark');
  const [repost, setRepost] = useOverrideAtom('repost');

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
  const onRepost = (bool: boolean) => () => {
    getCaller(bool)(post, 'reposts').then(refetchPost);
    setRepost((p) => new Map(p.entries()).set(post.id, bool));
  };
  const onBookmark = (bool: boolean) => () => {
    getCaller(bool)(post, 'bookmarks').then(refetchPost);
    setBookmark((p) => new Map(p.entries()).set(post.id, bool));
  };
  const onFavorite = (bool: boolean) => () => {
    getCaller(bool)(post, 'favorites').then(refetchPost);
    setFavorite((p) => new Map(p.entries()).set(post.id, bool));
  };

  //Repost액션
  const repostAnchor = useValue<HTMLElement | null>(null);
  const repostOpen = Boolean(repostAnchor.get);
  const onRepostClick = (e: MouseEvent<HTMLButtonElement>) => {
    repostAnchor.set(e.currentTarget);
  };
  const handleRepostClose = () => repostAnchor.set(null);

  return (
    <Box
      width='100%'
      display='flex'
      justifyContent='space-between'
      sx={{
        color: theme.palette.text.disabled,
      }}
      pr={3}
      onClick={(e) => e.stopPropagation()}
    >
      <Grid2 size={2}>
        <Stack direction='row' alignItems='center'>
          <Tooltip title='reply'>
            <IconButton
              color='inherit'
              disabled={!Boolean(user)}
              onClick={() => setIsWrite({ open: true, parent: post })}
            >
              <ModeCommentOutlined />
            </IconButton>
          </Tooltip>
          <Typography variant='caption'>{post.replies_count}</Typography>
        </Stack>
      </Grid2>
      <Grid2 size={2}>
        <Stack direction='row' alignItems='center'>
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
                onClick={onRepostClick}
                disabled={!Boolean(user)}
                color='inherit'
              >
                <CloudOutlined />
              </IconButton>
            )}
          </Tooltip>
          <Typography variant='caption'>{post.reposts_count}</Typography>
        </Stack>
        <Menu
          anchorEl={repostAnchor.get}
          open={repostOpen}
          onClose={handleRepostClose}
          // slots={{ paper: Box }}
          slotProps={{
            paper: {
              sx: {
                ...glassmorphism(theme),
                ...borderGlowing(theme),
                backgroundImage: `linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0))`,
                borderRadius: 3,
                ul: {
                  py: 0,
                  li: {
                    px: 1,
                  },
                },
              },
            },
          }}
          MenuListProps={{ sx: glassmorphism(theme) }}
        >
          <MenuItem
            onClick={(e) => {
              onRepost(true)();
              handleRepostClose();
            }}
            sx={{ bgcolor: 'transparent' }}
          >
            <ListItemIcon>
              <Cloud fontSize='small' />
            </ListItemIcon>
            <ListItemText>Cottoning</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleRepostClose();
              setIsWrite({ open: true, quote: post });
            }}
          >
            <ListItemIcon>
              <Create fontSize='small' />
            </ListItemIcon>
            <ListItemText>Quote</ListItemText>
          </MenuItem>
        </Menu>
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
          <Typography variant='caption'>{post.favorites_count}</Typography>
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
  );
};
