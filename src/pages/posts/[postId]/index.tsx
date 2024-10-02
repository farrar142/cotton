import API from '#/api';
import { Post } from '#/api/posts';
import { ClientOnlyHOC } from '#/components/ClientOnlyHOC';
import { PostDetailItem } from '#/components/layouts/pages/PostDetailPage/PostDetailItem';
import getInitialPropsWrapper from '#/functions/getInitialPropsWrapper';
import { useRouter } from '#/hooks/useCRouter';
import { ArrowBack } from '@mui/icons-material';
import { IconButton, Stack, Typography } from '@mui/material';

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
