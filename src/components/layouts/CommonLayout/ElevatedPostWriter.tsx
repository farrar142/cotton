import { ImageType } from '#/api/commons/types';
import { PostItem } from '#/components/timelines/PostItem';
import { ScrollPreventedBackdrop } from '#/components/utils/ScrollPreventedBackdrop';
import { usePostWriteService } from '#/hooks/posts/usePostWriteService';
import { useRouter } from '#/hooks/useCRouter';
import { useNoti } from '#/hooks/useNoti';
import { usePostWrite } from '#/hooks/usePostWrite';
import DraftEditor from '#/PostWriter/DraftEditor';
import { Block } from '#/utils/textEditor/blockTypes';
import { Close } from '@mui/icons-material';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
export const ElevatedPostWriter = () => {
  const router = useRouter();
  const noti = useSnackbar();
  const [isWrite, setIsWrite] = usePostWrite();
  const postWriteService = usePostWriteService();
  const onPost = (text: string, blocks: Block[][], images: ImageType[]) => {
    return postWriteService
      .onPost(text, blocks, images, isWrite.parent, isWrite.quote)
      .then(onClose)
      .then(({ data }) => {
        noti.enqueueSnackbar('Post Success', { variant: 'success' });
        return data;
      });
  };
  const onClose = <T extends any>(e: T) => {
    setIsWrite({ open: false });
    return e;
  };

  return (
    <ScrollPreventedBackdrop open={isWrite.open}>
      <Box
        onMouseDown={() => setIsWrite({ open: false, parent: undefined })}
        width='100%'
        height='100%'
        display='flex'
      >
        <Box
          bgcolor='background.default'
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          maxWidth={(theme) => theme.breakpoints.values.xs * 1.5}
          m='auto'
          borderRadius={5}
          p={1}
        >
          <IconButton size='small' onClick={onClose}>
            <Close />
          </IconButton>
          {isWrite.parent && (
            <Stack spacing={1}>
              <PostItem
                post={isWrite.parent}
                disableAction
                disableLatestRepost
                disableImages
                disableDivider
              />
              <Stack direction='row' spacing={1} pl={2} alignItems='center'>
                <Typography color='textDisabled' variant='subtitle2'>
                  reply to
                </Typography>
                <Typography color='primary'>
                  @{isWrite.parent.user.username}
                </Typography>
              </Stack>
              <Typography></Typography>
            </Stack>
          )}
          <Box width='100%' px={1} pt={1} minWidth='300px'>
            <DraftEditor
              maxLength={300}
              onPost={onPost}
              editorKey='elevatedEditor'
              placeholder={isWrite.parent ? `답글 게시하기` : undefined}
              quote={isWrite.quote}
            />
          </Box>
        </Box>
      </Box>
    </ScrollPreventedBackdrop>
  );
};
