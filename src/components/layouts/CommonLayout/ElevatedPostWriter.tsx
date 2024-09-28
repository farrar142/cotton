import API from '#/api';
import { ImageType } from '#/api/commons/types';
import { ScrollPreventedBackdrop } from '#/components/utils/ScrollPreventedBackdrop';
import { usePostWrite } from '#/hooks/usePostWrite';
import DraftEditor from '#/PostWriter/DraftEditor';
import { Block } from '#/utils/textEditor/blockTypes';
import { Close } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';

export const ElevatedPostWriter = () => {
  const [isWrite, setIsWrite] = usePostWrite();
  const onPost = (text: string, blocks: Block[][], images: ImageType[]) => {
    const mentions = blocks
      .map((line) => line.filter((block) => block.type === 'mention'))
      .flatMap((block) => block)
      .map((block) => ({ mentioned_to: parseInt(block.id) }));
    return API.Posts.post
      .postItem({ text, blocks, mentions, images })
      .then(({ data }) => {
        setIsWrite({ open: false });
        return data;
      });
  };

  return (
    <ScrollPreventedBackdrop open={isWrite.open}>
      <Box
        width='100%'
        height='100%'
        display='flex'
        justifyContent='center'
        alignItems='center'
        position='absolute'
        zIndex={20}
        onClick={() => setIsWrite({ open: false, parent: undefined })}
      >
        <Box
          bgcolor='background.default'
          onClick={(e) => e.stopPropagation()}
          maxWidth={(theme) => theme.breakpoints.values.xs * 1.5}
          width='100%'
          borderRadius={5}
          p={1}
        >
          <IconButton size='small'>
            <Close />
          </IconButton>
          <Box width='100%' px={1} pt={1}>
            <DraftEditor
              maxLength={300}
              onPost={onPost}
              editorKey='elevatedEditor'
            />
          </Box>
        </Box>
      </Box>
    </ScrollPreventedBackdrop>
  );
};
