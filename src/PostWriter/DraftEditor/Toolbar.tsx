import useUser from '#/hooks/useUser';
import useValue, { UseValue } from '#/hooks/useValue';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Popover,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import {
  EmojiEmotions,
  EmojiEmotionsOutlined,
  Image,
} from '@mui/icons-material';
import { EditorState } from 'draft-js';
import EmojiPicker from 'emoji-picker-react';
import { ChangeEventHandler, createRef, useId, useMemo } from 'react';
import { getBase64 } from '#/utils/images/getBase64';
import { resizeImage } from '#/utils/images/resizeImage';
import { ImageType } from '#/api/commons/types';
import { glassmorphism } from '#/styles';

const DraftEditorToolbar: React.FC<{
  images: UseValue<ImageType[]>;
  textLength: UseValue<number>;
  maxLength: number;
  editorState: EditorState;
  onPost: () => Promise<any>;
  onEmojiClick: (emoji: string) => void;
}> = ({ textLength, maxLength, images, editorState, onEmojiClick, onPost }) => {
  const theme = useTheme();
  const [user] = useUser();
  const onPosting = useValue(false);

  //Texts
  const isTextOver = useMemo(
    () => maxLength < textLength.get,
    [maxLength, textLength]
  );

  const [share, displayTextLength] = useMemo(() => {
    const remainder = textLength.get % maxLength;
    const share = Math.floor(textLength.get / maxLength);
    if (1 <= share && remainder === 0) return [share, maxLength];
    return [share, remainder];
  }, [textLength.get, maxLength]);

  //Images
  const inputRef = createRef<HTMLInputElement>();
  const onImageButtonClick = () => {
    if (!inputRef.current) return;
    inputRef.current.click();
  };

  const onPostButtonClick = () => {
    onPosting.set(true);
    onPost().finally(() => onPosting.set(false));
  };

  const onInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    const availableImageLength = 4 - images.get.length;
    const blobs = [...(e.target.files || [])].filter(
      (file, index) => index <= availableImageLength
    );
    e.currentTarget.value = '';
    e.target.value = '';
    if (blobs.length === 0) return;
    const files = Promise.all(blobs.map((file) => getBase64(file)));
    const resized = files.then((files) =>
      Promise.all(files.map((file) => resizeImage(file, 2048)))
    );
    const typed: Promise<ImageType[]> = resized.then((files) =>
      files.map((url) => ({ id: -1, url }))
    );
    typed.then((imgs) => images.set((p) => [...p, ...imgs]));
  };
  //Emojis
  const emojiElId = useId();
  const anchorEl = useValue<HTMLButtonElement | null>(null);

  return (
    <Box width='100%' display='flex' justifyContent='space-between'>
      <Stack direction='row' alignItems='center'>
        <IconButton size='small' color='primary' onClick={onImageButtonClick}>
          <Image />
          <input
            ref={inputRef}
            multiple
            type='file'
            accept='image/png, image/gif, image/jpeg'
            onChange={onInputChange}
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </IconButton>
        <IconButton
          color='primary'
          aria-describedby={emojiElId}
          onClick={(e) => anchorEl.set(e.currentTarget)}
        >
          <EmojiEmotionsOutlined />
        </IconButton>
        <Popover
          open={Boolean(anchorEl.get)}
          anchorEl={anchorEl.get}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          onClose={() => anchorEl.set(null)}
          sx={{
            aside: {
              ...glassmorphism(theme),
            },
            div: {
              bgcolor: 'transparent',
            },
            h2: {
              bgcolor: 'transparent',
            },
            input: {
              bgcolor: 'transparent',
            },
          }}
        >
          <EmojiPicker
            //@ts-ignore
            theme={theme.palette.mode}
            onEmojiClick={(e) => {
              onEmojiClick(e.emoji);
            }}
          />
        </Popover>
      </Stack>
      <Stack direction='row' spacing={1} alignItems='center' m={1}>
        <CircularProgress
          size='25px'
          color={Boolean(share) ? 'error' : 'primary'}
          variant='determinate'
          value={(displayTextLength * 100) / maxLength}
        />
        <Typography
          variant='caption'
          component='div'
          sx={{ color: Boolean(share) ? 'error.main' : 'text.secondary' }}
        >
          {textLength.get}/{maxLength}
        </Typography>
        <Button
          variant='contained'
          sx={{ borderRadius: 10 }}
          onClick={onPostButtonClick}
          disabled={
            onPosting.get ||
            isTextOver ||
            !Boolean(user) ||
            textLength.get === 0
          }
        >
          {onPosting.get ? <CircularProgress size={25} /> : '게시'}
        </Button>
      </Stack>
    </Box>
  );
};

export default DraftEditorToolbar;
