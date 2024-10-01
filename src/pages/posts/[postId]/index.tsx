import API from '#/api';
import { Post } from '#/api/posts';
import { ClientOnlyHOC } from '#/components/ClientOnlyHOC';
import TextInput from '#/components/inputs/TextInput';
import { PostTimeline } from '#/components/timelines';
import { PostItem, useCurrentPostItem } from '#/components/timelines/PostItem';
import getInitialPropsWrapper from '#/functions/getInitialPropsWrapper';
import { usePostWriteService } from '#/hooks/posts/usePostWriteService';
import { useRouter } from '#/hooks/useCRouter';
import useUser from '#/hooks/useUser';
import useValue from '#/hooks/useValue';
import DraftEditor, { DraftOnPost } from '#/PostWriter/DraftEditor';
import { ArrowBack } from '@mui/icons-material';
import {
  Avatar,
  Box,
  CircularProgress,
  Collapse,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import React, { Suspense } from 'react';

const PostDetailPage: ExtendedNextPage<{ post: Post }> = ({ post: _post }) => {
  const router = useRouter();
  const [user] = useUser();
  const replyClick = useValue(false);
  const postWriteService = usePostWriteService();
  const [post, setPost] = useCurrentPostItem(_post);
  const onReplyPost: DraftOnPost = async (text, blocks, images) => {
    return postWriteService.onPost(text, blocks, images, post).then((e) => {
      API.Posts.post
        .getItem(post.id)
        .then((r) => r.data)
        .then(setPost);
      return e;
    });
  };
  return (
    <Stack spacing={1}>
      <Stack
        spacing={2}
        px={2}
        py={1}
        direction='row'
        borderBottom={1}
        borderColor='divider'
        sx={{
          position: 'sticky',
          top: 0,
          backdropFilter: 'blur(5px)',
          zIndex: 2,
        }}
      >
        <IconButton onClick={() => router.back()}>
          <ArrowBack />
        </IconButton>
        <Typography variant='h5'>Post</Typography>
      </Stack>
      <PostItem post={post} routingToDetail={false} showChildLine showParent />
      {user ? (
        <>
          <Stack px={2} spacing={1}>
            <Collapse in={replyClick.get}>
              <Stack direction='row' px={7} spacing={1}>
                <Typography color='info'>@{post.user.nickname}</Typography>
                <Typography>님에게 보내는 답글</Typography>
              </Stack>
            </Collapse>
            <Stack display='flex' direction='row' spacing={2}>
              <Box
                display='flex'
                justifyContent='center'
                alignItems='flex-start'
              >
                <Avatar
                  src={user.profile_image?.medium || user.profile_image?.url}
                />
              </Box>
              <Box onMouseDown={() => replyClick.set(true)} width='100%'>
                <DraftEditor
                  maxLength={300}
                  onPost={onReplyPost}
                  editorKey='replyPost'
                  placeholder={`답글 게시하기`}
                  showToolbar={replyClick.get}
                />
              </Box>
            </Stack>
          </Stack>
          <Divider />
        </>
      ) : (
        <></>
      )}
      <PostTimeline
        getter={API.Posts.post.getReplies(post.id)}
        type={`${post.id}/replies`}
        disableLatestRepost
      />
    </Stack>
  );
};

PostDetailPage.getInitialProps = getInitialPropsWrapper(
  ({ query }) =>
    new Promise((res, rej) => {
      const postId = `${query.postId}`;
      API.Posts.post
        .getItem(postId)
        .then((r) => r.data)
        .then((post) => res({ post }))
        .catch(() => rej({ error: true, statusCode: 404 }));
    })
);

export default ClientOnlyHOC(PostDetailPage);
