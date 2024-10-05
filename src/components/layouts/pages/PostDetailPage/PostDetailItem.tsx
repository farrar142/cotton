import API from '#/api';
import { Post } from '#/api/posts';
import { PostTimeline } from '#/components/timelines';
import { PostItem } from '#/components/timelines/PostItem';
import { useCurrentPostData } from '#/hooks/posts/usePostData';
import { usePostWriteService } from '#/hooks/posts/usePostWriteService';
import useUser from '#/hooks/useUser';
import useValue from '#/hooks/useValue';
import DraftEditor, { DraftOnPost } from '#/PostWriter/DraftEditor';
import {
  Stack,
  Collapse,
  Typography,
  Box,
  Avatar,
  Divider,
} from '@mui/material';
import React, { useRef } from 'react';

export const PostDetailItem: React.FC<{ post: Post }> = ({ post: _post }) => {
  const [user] = useUser();
  const replyClick = useValue(false);
  const postWriteService = usePostWriteService();
  const [post, setPost] = useCurrentPostData(_post);
  const fetchChild = useRef(() => {});
  const onReplyPost: DraftOnPost = async (text, blocks, images) => {
    return postWriteService.onPost(text, blocks, images, post).then((e) => {
      API.Posts.post
        .getItem(post.id)
        .then((r) => r.data)
        .then(setPost)
        .then(fetchChild.current);
      return e;
    });
  };
  return (
    <Stack spacing={1}>
      <PostItem
        post={post}
        routingToDetail={false}
        showChildLine
        showParent
        isDetailView
      />
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
        pollingWhenEmpty={false}
        fetchNew={fetchChild}
      />
    </Stack>
  );
};
