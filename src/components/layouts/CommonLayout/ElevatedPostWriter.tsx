import API from '#/api';
import { ImageType } from '#/api/commons/types';
import { PostItem } from '#/components/timelines/PostItem';
import { ScrollPreventedBackdrop } from '#/components/utils/ScrollPreventedBackdrop';
import { usePostWriteService } from '#/hooks/posts/usePostWriteService';
import { useRouter } from '#/hooks/useCRouter';
import { usePostWrite } from '#/hooks/usePostWrite';
import DraftEditor from '#/PostWriter/DraftEditor';
import { MentionEntry } from '#/PostWriter/DraftEditor/mention';
import { Block } from '#/utils/textEditor/blockTypes';
import { Close } from '@mui/icons-material';
import {
  Backdrop,
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { MouseEvent } from 'react';

export const ElevatedPostWriter = () => {
  const router = useRouter();
  const [isWrite, setIsWrite] = usePostWrite();
  const postWriteService = usePostWriteService();
  const onPost = (text: string, blocks: Block[][], images: ImageType[]) => {
    return postWriteService
      .onPost(text, blocks, images, isWrite.parent)
      .then(onClose)
      .then(({ data }) => {
        router.reload();
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
                <MentionEntry
                  onMouseDown={(e) => {}}
                  onMouseUp={(e) => {}}
                  onMouseEnter={(e) => {}}
                  role={''}
                  id={''}
                  mention={{
                    ...isWrite.parent.user,
                    name: isWrite.parent.user.nickname,
                  }}
                  isFocused={false}
                />
                <Typography color='textDisabled' variant='subtitle2'>
                  님에게 보내는 답글
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
            />
          </Box>
        </Box>
      </Box>
    </ScrollPreventedBackdrop>
  );
};
