import API from '#/api';
import { Post } from '#/api/posts';
import { ClientOnlyHOC } from '#/components/ClientOnlyHOC';
import TextInput from '#/components/inputs/TextInput';
import { PostDetailItem } from '#/components/layouts/pages/PostDetailPage/PostDetailItem';
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

const PostDetailPage: ExtendedNextPage<{ post: Post }> = ({ post }) => {
  const router = useRouter();
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
      <PostDetailItem post={post} />
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
